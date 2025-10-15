import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, User, MessageSquare } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  reviewType: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar: string;
}

interface PublicProfileData {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  rating: number;
  is_performer: boolean;
  skills: Skill[];
  reviews: Review[];
}

async function fetchPublicProfile(userId: string): Promise<PublicProfileData> {
  const response = await fetch(`/v1/users/${userId}/public-profile`);
  if (!response.ok) {
    throw new Error('Failed to fetch public profile');
  }
  return response.json();
}

export default function PublicProfile() {
  const { userId } = useParams<{ userId: string }>();

  const { data: profile, isLoading, error } = useQuery<PublicProfileData>({
    queryKey: ['publicProfile', userId],
    queryFn: () => fetchPublicProfile(userId!),
    enabled: !!userId,
    retry: 1
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="container max-w-4xl py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Завантаження...</h1>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !profile) {
    return (
      <Layout>
        <div className="container max-w-4xl py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Профіль не знайдено</h1>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-4xl py-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                    <AvatarFallback className="text-lg">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center space-y-2">
                    <h2 className="text-xl font-semibold">{profile.name}</h2>
                    {profile.rating && (
                      <div className="flex items-center justify-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{Number(profile.rating).toFixed(1)}</span>
                        <span className="text-xs text-muted-foreground">({profile.reviews?.length || 0})</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Про користувача</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{profile.bio || 'Немає опису'}</p>
              </CardContent>
            </Card>
            {profile.is_performer && profile.skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Навички</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {profile.skills.map(skill => (
                    <Badge key={skill.id} variant="outline">
                      {skill.name}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            )}
            {profile.reviews && profile.reviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Відгуки</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.reviews.map(review => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={review.reviewerAvatar} alt={review.reviewerName} />
                          <AvatarFallback>
                            {review.reviewerName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{review.reviewerName}</span>
                            <div className="flex items-center space-x-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          {review.comment && (
                            <p className="text-sm text-muted-foreground">{review.comment}</p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
