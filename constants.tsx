
import React from 'react';
import { Briefcase, Sprout, Globe, Users, ShieldCheck, Scale, Award, Heart, Eye, Target, Compass, Zap, Handshake, Calendar, MapPin } from 'lucide-react';
import { Objective, Program } from './types.ts';

export const MISSION = "To empower adults and youth with diverse disabilities in rural Tanzania through vocational excellence, economic inclusion, and rights-based advocacy, bridging the gap between education and independent living, as led by the Marcus Foundation.";

export const VISION = "A Tanzania where every adult with a disability leads a dignified, self-reliant life, fully integrated into the socio-economic fabric of their community through the Marcus Foundation's initiatives.";

export const PHILOSOPHY = [
  {
    title: "Radical Inclusion",
    description: "We believe inclusion is not an afterthought but a fundamental right. Our programs are designed from the ground up to accommodate the widest spectrum of physical, intellectual, and sensory needs.",
    icon: Users
  },
  {
    title: "Dignity Through Autonomy",
    description: "Our core belief is that economic independence is the ultimate path to social dignity. We don't just provide aid; we provide the tools for self-sustenance.",
    icon: Award
  },
  {
    title: "Rural-First Strategy",
    description: "Impact shouldn't stop at city limits. We prioritize the hard-to-reach rural districts where infrastructure is lacking but potential is abundant.",
    icon: Compass
  },
  {
    title: "PWD-Led Leadership",
    description: "Nothing for us without us. Our organization is governed and driven by people who live the disability experience every day.",
    icon: ShieldCheck
  }
];

export const EVENTS = [
  {
    id: 'evt-1',
    title: 'Dodoma Empowerment Summit',
    date: 'Oct 15, 2024',
    location: 'Dodoma Central Hub',
    description: 'A gathering of community leaders and stakeholders to discuss economic barriers facing rural adults with disabilities.',
    icon: Users
  },
  {
    id: 'evt-2',
    title: 'Vocational Skills Workshop',
    date: 'Nov 05, 2024',
    location: 'Mbeya Training Center',
    description: 'Hands-on training session for our first cohort of tailoring and digital literacy students.',
    icon: Briefcase
  },
  {
    id: 'evt-3',
    title: 'Advocacy Awareness Walk',
    date: 'Dec 03, 2024',
    location: 'National Level',
    description: 'Celebrating International Day of Persons with Disabilities with a community-led march for rights and inclusion.',
    icon: Handshake
  }
];

export const SHORT_TERM_OBJECTIVES: Objective[] = [
  {
    id: 'st-1',
    title: 'Legal & Organizational Setup',
    timeline: 'Month 0 - 6',
    description: 'Establish foundational legal structure and community presence.',
    metrics: ['Register as Marcus Foundation with Ministry of Home Affairs', 'Secure hub in rural district (Dodoma/Mbeya)', 'Recruit 5-member core team (50% PWD)'],
    type: 'short-term'
  },
  {
    id: 'st-2',
    title: 'Needs Assessment',
    timeline: 'Year 1',
    description: 'Comprehensive data gathering to drive evidence-based programming.',
    metrics: ['Survey 300+ adults with diverse disabilities', 'Identify specific economic barriers', 'Publish baseline report for stakeholders'],
    type: 'short-term'
  },
  {
    id: 'st-3',
    title: 'Pilot Vocational Program',
    timeline: 'Year 2',
    description: 'Training in market-relevant skills for independent living.',
    metrics: ['Train 100+ adults in tailoring/agri/digital', '60% participants starting income activity', 'Entrepreneurship basics certification'],
    type: 'short-term'
  }
];

export const LONG_TERM_OBJECTIVES: Objective[] = [
  {
    id: 'lt-1',
    title: 'Economic Empowerment Scale-Up',
    timeline: 'Year 3 - 5+',
    description: 'Scaling impact across multiple rural districts.',
    metrics: ['Empower 500+ adults across 5 districts', '70% report sustainable income increase', '50% in viable micro-enterprises'],
    type: 'long-term'
  },
  {
    id: 'lt-2',
    title: 'Policy Advocacy',
    timeline: 'Year 5 - 7',
    description: 'Influencing systemic change at national and regional levels.',
    metrics: ['Advocate for inclusive govt funding', 'Improve procedures for 200+ PWD annually', 'Contribute to National Disability Policy updates'],
    type: 'long-term'
  }
];

export const PROGRAMS: Program[] = [
  {
    id: 'vocational',
    title: 'Vocational Training',
    description: 'Hands-on training in tailoring, handicrafts, and basic digital literacy tailored for diverse needs.',
    icon: 'Briefcase',
    image: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'agri',
    title: 'Small-Scale Farming',
    description: 'Inclusive horticulture and climate-smart agriculture programs for rural sustainability.',
    icon: 'Sprout',
    image: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'finance',
    title: 'Financial Inclusion',
    description: 'Assisting PWD in accessing interest-free government loans and local empowerment funds through targeted financial literacy workshops.',
    icon: 'Scale',
    image: 'https://images.unsplash.com/photo-1590650153855-d9e808231d41?q=80&w=800&auto=format&fit=crop'
  }
];

export const getIcon = (name: string, className?: string) => {
  const icons: Record<string, any> = {
    Briefcase, Sprout, Globe, Users, ShieldCheck, Scale, Award, Heart, Eye, Target, Compass, Zap, Handshake, Calendar, MapPin
  };
  const Icon = icons[name] || Heart;
  return <Icon className={className} />;
};
