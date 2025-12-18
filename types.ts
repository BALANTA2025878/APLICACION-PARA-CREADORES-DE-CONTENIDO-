
export type ToolType = 'text' | 'image' | 'video' | 'audio' | 'dashboard' | 'templates';

export interface GeneratedAsset {
  id: string;
  type: ToolType;
  title: string;
  content: string; // URL for images/videos, text for blog/captions
  timestamp: number;
  tags?: string[];
}

export interface VideoState {
  isGenerating: boolean;
  progress: string;
  operationId?: string;
}

export enum VoiceName {
  ZEPHYR = 'Zephyr',
  PUCK = 'Puck',
  CHARON = 'Charon',
  KORE = 'Kore',
  FENRIR = 'Fenrir'
}

export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  fields: {
    label: string;
    key: string;
    type: 'text' | 'textarea' | 'select';
    placeholder?: string;
    options?: string[];
  }[];
}
