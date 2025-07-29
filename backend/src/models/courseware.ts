import mongoose from 'mongoose';
import { CourseContent, CourseInfo, GenerationOptions } from '../../../shared/types.js';

// 课件模型
const coursewareSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  courseInfo: {
    subject: {
      id: String,
      name: String,
      icon: String
    },
    grade: {
      id: String,
      name: String,
      level: Number
    },
    volume: {
      id: String,
      name: String,
      semester: String
    },
    title: { type: String, required: true }
  },
  content: {
    overview: String,
    concepts: [{
      id: String,
      term: String,
      definition: String,
      examples: [String],
      relatedConcepts: [String]
    }],
    formulas: [{
      id: String,
      name: String,
      expression: String,
      description: String,
      variables: [{
        symbol: String,
        name: String,
        unit: String,
        description: String
      }],
      applications: [String]
    }],
    diagrams: [{
      id: String,
      title: String,
      type: String,
      url: String,
      description: String,
      tags: [String]
    }],
    interactions: [{
      id: String,
      type: String,
      title: String,
      content: mongoose.Schema.Types.Mixed,
      difficulty: String
    }],
    resources: [{
      id: String,
      type: String,
      title: String,
      url: String,
      source: String,
      quality: String,
      relevanceScore: Number
    }]
  },
  generationOptions: {
    includeInteractions: Boolean,
    searchOnlineResources: Boolean,
    generateDiagrams: Boolean,
    difficultyLevel: String,
    language: String
  },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
  progress: { type: Number, default: 0 },
  error: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Courseware = mongoose.model('Courseware', coursewareSchema);