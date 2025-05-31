
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, CheckCircle, ArrowRight, Star } from 'lucide-react';

// Mock data for featured services
const featuredServices = [
  {
    id: '1',
    title: 'Professional Logo Design',
    description: 'Get a custom logo design for your business with unlimited revisions.',
    category: 'design',
    tags: ['Logo', 'Branding', 'Creative'],
    price: 49.99,
    currency: 'USD',
    deliveryTime: 2,
    performer: {
      id: '101',
      name: 'Alex Designer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&h=250&fit=crop',
      rating: 4.8
    },
    rating: 4.8,
    reviewCount: 124,
    image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=500&h=350&fit=crop'
  },
  {
    id: '2',
    title: 'Website Development',
    description: 'Custom website development using React, Next.js, and Tailwind CSS.',
    category: 'development',
    tags: ['React', 'Next.js', 'Web'],
    price: 199.99,
    currency: 'USD',
    deliveryTime: 7,
    performer: {
      id: '102',
      name: 'Maria Dev',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&h=250&fit=crop',
      rating: 4.9
    },
    rating: 4.9,
    reviewCount: 87,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&h=350&fit=crop'
  },
  {
    id: '3',
    title: 'SEO Optimization',
    description: 'Boost your website ranking with professional SEO optimization.',
    category: 'marketing',
    tags: ['SEO', 'Marketing', 'Ranking'],
    price: 99.99,
    currency: 'USD',
    deliveryTime: 5,
    performer: {
      id: '103',
      name: 'John SEO',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=250&h=250&fit=crop',
      rating: 4.7
    },
    rating: 4.7,
    reviewCount: 63,
    image: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=500&h=350&fit=crop'
  },
  {
    id: '4',
    title: 'Content Writing',
    description: 'Professional content writing for your blog, website, or social media.',
    category: 'writing',
    tags: ['Writing', 'Content', 'Blog'],
    price: 29.99,
    currency: 'USD',
    deliveryTime: 3,
    performer: {
      id: '104',
      name: 'Emma Writer',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=250&h=250&fit=crop',
      rating: 4.6
    },
    rating: 4.6,
    reviewCount: 98,
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500&h=350&fit=crop'
  }
];

// Mock data for categories
const categories = [
  { id: '1', name: 'Design', icon: '🎨' },
  { id: '2', name: 'Development', icon: '💻' },
  { id: '3', name: 'Writing', icon: '✍️' },
  { id: '4', name: 'Marketing', icon: '📈' },
  { id: '5', name: 'Video', icon: '🎥' },
  { id: '6', name: 'Music', icon: '🎵' },
  { id: '7', name: 'Business', icon: '💼' },
  { id: '8', name: 'Lifestyle', icon: '🌱' }
];

// Mock data for how it works
const steps = [
  {
    id: '1',
    title: 'Find a Service',
    description: 'Browse through our marketplace to find the perfect service for your needs.',
    icon: '🔍'
  },
  {
    id: '2',
    title: 'Place an Order',
    description: 'Submit your requirements and make a payment to begin the project.',
    icon: '📋'
  },
  {
    id: '3',
    title: 'Get Updates via Telegram',
    description: 'Receive real-time notifications and updates through our Telegram bot.',
    icon: '📱'
  },
  {
    id: '4',
    title: 'Review and Approve',
    description: 'Review the delivered work and request revisions if needed.',
    icon: '✅'
  }
];

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-blue to-brand-darkBlue text-white py-16">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Find the Perfect Digital Service
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl opacity-90 animate-slide-in">
            Connect with expert performers and get your projects done with Telegram integration
          </p>
          
          <div className="w-full max-w-md mb-8">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for services..."
                className="pl-10 pr-4 py-6 rounded-full bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/70"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
            </div>
          </div>
          
          <Button size="lg" asChild className="rounded-full px-8 bg-brand-amber hover:bg-brand-amber/90 text-white">
            <Link to="/services">Browse Services</Link>
          </Button>
          
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <div className="flex items-center">
              <CheckCircle className="text-brand-amber mr-2 h-5 w-5" />
              <span>Quality Work</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="text-brand-amber mr-2 h-5 w-5" />
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="text-brand-amber mr-2 h-5 w-5" />
              <span>Telegram Updates</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="text-brand-amber mr-2 h-5 w-5" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Popular Categories</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map(category => (
              <Link to={`/services?category=${category.name.toLowerCase()}`} key={category.id}>
                <div className="bg-card hover-card rounded-lg p-4 flex flex-col items-center justify-center text-center h-32">
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <h3 className="font-medium">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Services</h2>
            <Button variant="outline" asChild>
              <Link to="/services">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredServices.map(service => (
              <Link to={`/services/${service.id}`} key={service.id}>
                <Card className="overflow-hidden hover-card border">
                  <div className="aspect-video relative">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute bottom-2 right-2">
                      <Badge className="bg-brand-teal hover:bg-brand-teal">
                        {service.price.toFixed(2)} {service.currency}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center mb-3">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={service.performer.avatar} alt={service.performer.name} />
                        <AvatarFallback>{service.performer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{service.performer.name}</span>
                      <div className="ml-auto flex items-center text-amber-500">
                        <Star className="fill-amber-500 stroke-amber-500 h-4 w-4" />
                        <span className="ml-1 text-sm">{service.rating}</span>
                      </div>
                    </div>
                    
                    <h3 className="font-bold mb-2 line-clamp-1">{service.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {service.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1">
                      {service.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center text-center">
                <div className="text-4xl mb-4">{step.icon}</div>
                <div className="text-2xl font-bold mb-2 text-primary">{step.title}</div>
                <p className="text-muted-foreground">{step.description}</p>
                
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2">
                    <ArrowRight className="h-6 w-6 text-muted-foreground/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-12">
            <Button size="lg" asChild>
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Telegram Integration Section */}
      <section className="py-16 bg-brand-blue text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-4">Seamless Telegram Integration</h2>
              <p className="text-lg mb-6 opacity-90">
                Stay updated on your orders and communicate with performers directly through our Telegram bot.
                Receive notifications, manage orders, and chat with performers - all without leaving Telegram.
              </p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-brand-amber" />
                  <span>Real-time order notifications</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-brand-amber" />
                  <span>Direct chat with clients/performers</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-brand-amber" />
                  <span>Order status updates</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-brand-amber" />
                  <span>Deadline reminders</span>
                </li>
              </ul>
              
              <Button size="lg" asChild className="bg-brand-amber hover:bg-brand-amber/90 text-white">
                <Link to="https://t.me/hiwwer_bot" target="_blank">
                  Connect Telegram
                </Link>
              </Button>
            </div>
            
            <div className="md:w-1/2 md:pl-8">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-xl">🤖</span>
                  </div>
                  <div className="ml-3">
                    <div className="font-bold">Hiwwer Bot</div>
                    <div className="text-xs opacity-70">Online</div>
                  </div>
                </div>
                
                {/* Mock chat messages */}
                <div className="space-y-3 mb-4">
                  <div className="flex flex-col">
                    <div className="bg-blue-600 text-white p-2 rounded-t-lg rounded-r-lg self-start max-w-[80%]">
                      Welcome to Hiwwer Bot! I'll help you manage your orders and communicate with performers.
                    </div>
                    <span className="text-xs opacity-50 mt-1">Hiwwer Bot, 10:45 AM</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="bg-white/20 p-2 rounded-t-lg rounded-l-lg self-end max-w-[80%]">
                      Hi! I'd like to check my order status.
                    </div>
                    <span className="text-xs opacity-50 mt-1 self-end">You, 10:46 AM</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="bg-blue-600 text-white p-2 rounded-t-lg rounded-r-lg self-start max-w-[80%]">
                      Your order #12345 is in progress. The performer has completed 60% of the work and will deliver on time.
                    </div>
                    <span className="text-xs opacity-50 mt-1">Hiwwer Bot, 10:47 AM</span>
                  </div>
                </div>
                
                <div className="flex">
                  <Input 
                    type="text" 
                    placeholder="Type a message..." 
                    className="mr-2 bg-white/10 border-white/20 placeholder:text-white/50 text-white"
                  />
                  <Button size="sm" className="bg-brand-amber hover:bg-brand-amber/90">Send</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-muted-foreground">
            Join Hiwwer today and connect with talented performers or offer your skills to clients worldwide.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/register?role=client">
                I Need a Service
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/register?role=performer">
                I Want to Offer Services
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
