import { z } from 'zod';

// Step 1 validation schema
export const step1Schema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
});

// Step 2 validation schema
export const step2Schema = z.object({
  companySearch: z.string().min(1, 'Company search is required'),
  workspaceName: z.string().min(1, 'Workspace name is required'),
  websiteUrl: z.string().optional().or(z.literal('')),
  workspaceSlug: z.string().min(1, 'Workspace slug is required'),
  workspaceLogo: z.any().optional(), // File upload - optional
});

export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;

