import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/sonner';

interface Skill {
  id: string;
  name: string;
}

interface SkillsManagementProps {
  userId: string;
  onClose: () => void;
}

async function fetchAllSkills(): Promise<Skill[]> {
  const response = await fetch('/v1/skills');
  if (!response.ok) {
    throw new Error('Failed to fetch skills');
  }
  return response.json();
}

async function fetchUserSkills(userId: string): Promise<Skill[]> {
  const response = await fetch(`/v1/users/${userId}/skills`);
  if (!response.ok) {
    throw new Error('Failed to fetch user skills');
  }
  return response.json();
}

async function updateUserSkills(userId: string, skillIds: string[]): Promise<void> {
  const response = await fetch('/v1/skills/profile/skills', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ skillIds })
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update skills');
  }
}

export default function SkillsManagement({ userId, onClose }: SkillsManagementProps) {
  const queryClient = useQueryClient();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const { data: allSkills = [], isLoading: isLoadingAllSkills } = useQuery<Skill[]>({
    queryKey: ['skills'],
    queryFn: fetchAllSkills
  });

  const { data: userSkills = [], isLoading: isLoadingUserSkills } = useQuery<Skill[]>({
    queryKey: ['userSkills', userId],
    queryFn: () => fetchUserSkills(userId)
  });

  useEffect(() => {
    if (userSkills.length > 0) {
      setSelectedSkills(userSkills.map(skill => skill.id));
    }
  }, [userSkills]);

  const updateSkillsMutation = useMutation({
    mutationFn: (skillIds: string[]) => updateUserSkills(userId, skillIds),
    onSuccess: () => {
      toast.success('Навички успішно оновлено');
      queryClient.invalidateQueries({ queryKey: ['userSkills', userId] });
      onClose();
    },
    onError: () => {
      toast.error('Помилка оновлення навичок');
    }
  });

  const handleToggleSkill = (skillId: string) => {
    setSelectedSkills(prev =>
      prev.includes(skillId)
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
  };

  const handleSave = () => {
    updateSkillsMutation.mutate(selectedSkills);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Керування навичками</h2>
        {isLoadingAllSkills || isLoadingUserSkills ? (
          <p>Завантаження...</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {allSkills.map(skill => (
              <div key={skill.id} className="flex items-center space-x-2">
                <Checkbox
                  id={skill.id}
                  checked={selectedSkills.includes(skill.id)}
                  onCheckedChange={() => handleToggleSkill(skill.id)}
                />
                <label htmlFor={skill.id} className="text-sm font-medium leading-none">
                  {skill.name}
                </label>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Скасувати
          </Button>
          <Button onClick={handleSave} disabled={updateSkillsMutation.status === 'pending'}>
            Зберегти
          </Button>
        </div>
      </div>
    </div>
  );
}