import React from 'react';
import {
  Hammer,
  Users,
  Sparkles,
  Armchair,
  FileText,
  AlertTriangle,
  Layers,
  Wrench,
  Paintbrush,
  Home,
  Tag,
  Boxes,
  Zap,
  Droplets,
  Package,
} from 'lucide-react';

interface CategoryIconProps {
  iconName: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ iconName, className = 'w-5 h-5' }) => {
  switch (iconName) {
    case 'Hammer':
      return <Hammer className={className} />;
    case 'Users':
      return <Users className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Armchair':
      return <Armchair className={className} />;
    case 'FileText':
      return <FileText className={className} />;
    case 'AlertTriangle':
      return <AlertTriangle className={className} />;
    case 'Wrench':
      return <Wrench className={className} />;
    case 'Paintbrush':
      return <Paintbrush className={className} />;
    case 'Home':
      return <Home className={className} />;
    case 'Zap':
      return <Zap className={className} />;
    case 'Droplets':
      return <Droplets className={className} />;
    case 'Boxes':
      return <Boxes className={className} />;
    case 'Package':
      return <Package className={className} />;
    default:
      return <Tag className={className} />;
  }
};
