import type { Domain, RoadmapStage } from './types'

export const DOMAINS: Domain[] = ['Software & Technology', 'Agriculture', 'Research', 'Healthcare', 'Business']

export const STAGE_TITLES = [
  'Idea Submission',
  'Problem Identification',
  'Idea Clarification',
  'Feasibility Analysis',
  'Solution Selection',
  'Architecture and Planning',
  'Team Formation',
  'Task Distribution',
  'Development',
  'Testing and Evaluation',
  'Mentor Review',
  'Project Completion',
  'Project Showcase',
] as const

interface StageTemplate {
  focus: string
  description: string
  objectives: string[]
  checklist: string[]
  resources: { title: string; url: string }[]
}

const BASE: StageTemplate[] = [
  {
    focus: 'Capture the idea',
    description: 'Record the initial idea, the motivation behind it and who it is meant to help.',
    objectives: ['Document the core idea in one paragraph', 'Identify the intended beneficiaries'],
    checklist: ['Write a one-paragraph idea summary', 'List target users or beneficiaries', 'Publish the idea on the SkillSync feed'],
    resources: [{ title: 'Writing a clear problem statement', url: 'https://www.interaction-design.org/literature/topics/problem-statements' }],
  },
  {
    focus: 'Understand the problem',
    description: 'Validate that the problem is real, significant and worth solving by gathering evidence.',
    objectives: ['Gather evidence that the problem exists', 'Define the scope of the problem'],
    checklist: ['Interview or survey at least 5 affected people', 'Summarise existing solutions and their gaps', 'Write a final problem statement'],
    resources: [{ title: 'IDEO Design Kit – Interviews', url: 'https://www.designkit.org/methods/interview' }],
  },
  {
    focus: 'Sharpen the concept',
    description: 'Refine the idea into a concrete concept with clear goals, constraints and success criteria.',
    objectives: ['Define measurable success criteria', 'List assumptions and constraints'],
    checklist: ['Define 3 measurable success criteria', 'List key assumptions', 'Sketch the concept'],
    resources: [{ title: 'Lean Canvas overview', url: 'https://leanstack.com/lean-canvas' }],
  },
  {
    focus: 'Check viability',
    description: 'Assess whether the idea is technically, financially and practically achievable.',
    objectives: ['Evaluate technical feasibility', 'Estimate cost and resource needs'],
    checklist: ['Estimate budget and resources', 'Identify major risks', 'Confirm required skills are available or learnable'],
    resources: [{ title: 'Feasibility study basics', url: 'https://www.investopedia.com/terms/f/feasibility-study.asp' }],
  },
  {
    focus: 'Choose the approach',
    description: 'Compare alternative solutions and select the most promising approach.',
    objectives: ['Compare at least two alternatives', 'Select and justify the final approach'],
    checklist: ['List 2–3 alternative approaches', 'Score alternatives against criteria', 'Document the chosen approach'],
    resources: [{ title: 'Decision matrix method', url: 'https://asq.org/quality-resources/decision-matrix' }],
  },
  {
    focus: 'Plan the build',
    description: 'Design the overall structure of the solution and plan milestones.',
    objectives: ['Produce a high-level design', 'Define milestones and timeline'],
    checklist: ['Create a high-level design diagram', 'Define milestones', 'Agree on tools and workflow'],
    resources: [{ title: 'Project planning guide', url: 'https://www.atlassian.com/work-management/project-management/project-planning' }],
  },
  {
    focus: 'Assemble the team',
    description: 'Recruit collaborators with complementary skills and define roles.',
    objectives: ['Cover all required skills', 'Assign clear roles'],
    checklist: ['Review skill-gap analysis', 'Invite collaborators with missing skills', 'Assign team roles'],
    resources: [{ title: 'Building effective teams', url: 'https://rework.withgoogle.com/guides/understanding-team-effectiveness/' }],
  },
  {
    focus: 'Divide the work',
    description: 'Break milestones into tasks and assign owners with deadlines.',
    objectives: ['Create a task backlog', 'Assign every task an owner and deadline'],
    checklist: ['Create tasks for the first milestone', 'Assign owners and priorities', 'Set up a weekly check-in'],
    resources: [{ title: 'Kanban basics', url: 'https://www.atlassian.com/agile/kanban' }],
  },
  {
    focus: 'Build the solution',
    description: 'Execute the plan and build the solution iteratively.',
    objectives: ['Deliver a working first version', 'Track progress weekly'],
    checklist: ['Complete first working version', 'Share weekly progress updates', 'Document key decisions'],
    resources: [{ title: 'GitHub Docs', url: 'https://docs.github.com' }],
  },
  {
    focus: 'Validate results',
    description: 'Test the solution against the success criteria and gather feedback.',
    objectives: ['Measure results against success criteria', 'Collect user feedback'],
    checklist: ['Run evaluation against success criteria', 'Collect feedback from users', 'Fix critical issues'],
    resources: [{ title: 'Usability testing 101', url: 'https://www.nngroup.com/articles/usability-testing-101/' }],
  },
  {
    focus: 'Expert review',
    description: 'Present progress to the mentor and incorporate their feedback.',
    objectives: ['Receive structured mentor feedback', 'Address review comments'],
    checklist: ['Share project summary with mentor', 'Hold a review session', 'Address mentor feedback'],
    resources: [{ title: 'Giving and receiving feedback', url: 'https://www.mindtools.com/a3m0vdx/giving-feedback' }],
  },
  {
    focus: 'Wrap up',
    description: 'Finalise deliverables, documentation and handover.',
    objectives: ['Finalise all deliverables', 'Complete documentation'],
    checklist: ['Finalise deliverables', 'Write final report or README', 'Record each member contribution'],
    resources: [{ title: 'Writing a project report', url: 'https://www.monash.edu/student-academic-success/excel-at-writing/how-to-write/report' }],
  },
  {
    focus: 'Share with the world',
    description: 'Showcase the project to the college, mentors and industry.',
    objectives: ['Publish the completed project', 'Present to a wider audience'],
    checklist: ['Publish as completed on SkillSync', 'Prepare a presentation or demo video', 'Submit to a relevant competition or event'],
    resources: [{ title: 'Pitching your project', url: 'https://www.ycombinator.com/library/4b-how-to-pitch-your-company' }],
  },
]

type Overrides = Partial<Record<number, Partial<StageTemplate>>>

const DOMAIN_OVERRIDES: Record<Domain, Overrides> = {
  'Software & Technology': {
    3: { checklist: ['Evaluate tech stack options', 'Check API and data availability', 'Estimate hosting and infrastructure cost'] },
    5: {
      focus: 'System architecture',
      description: 'Design the software architecture, data model and interfaces before development begins.',
      checklist: ['Draw the system architecture diagram', 'Define the data model', 'Design key screens / API contracts', 'Set up repository and CI'],
    },
    8: {
      focus: 'Software development',
      description: 'Build features iteratively in short sprints with code reviews.',
      checklist: ['Implement core features', 'Conduct code reviews', 'Deploy a staging version'],
    },
    9: {
      focus: 'Software testing',
      description: 'Run unit, integration and usability tests and fix defects.',
      checklist: ['Write unit tests for core logic', 'Run integration tests', 'Conduct usability testing with 5 users', 'Fix critical bugs'],
    },
  },
  Agriculture: {
    1: { checklist: ['Visit farms and interview farmers', 'Collect soil, crop or water data', 'Write a final problem statement'] },
    3: { checklist: ['Assess climate and soil suitability', 'Estimate equipment and field costs', 'Check seasonal timing constraints'] },
    5: {
      focus: 'Field design',
      description: 'Design the field layout, sensor or treatment placement and experimental plots.',
      objectives: ['Design the field layout', 'Plan control and test plots'],
      checklist: ['Prepare the field layout plan', 'Define control and test plots', 'Plan equipment and sensor placement', 'Agree on a data collection schedule'],
    },
    8: {
      focus: 'Field implementation',
      description: 'Install equipment, implement the solution in the field and collect data.',
      objectives: ['Implement the solution on the test plot', 'Collect field data regularly'],
      checklist: ['Install equipment on the test plot', 'Begin regular data collection', 'Log field observations weekly'],
    },
    9: {
      focus: 'Field trials',
      description: 'Run field trials across a growing cycle and compare results with control plots.',
      objectives: ['Compare test vs control results', 'Measure yield, water or cost impact'],
      checklist: ['Complete at least one field trial cycle', 'Compare results with control plots', 'Gather farmer feedback'],
    },
  },
  Research: {
    1: { focus: 'Literature review', checklist: ['Review at least 10 relevant papers', 'Identify the research gap', 'Write the research question'] },
    3: { checklist: ['Check data and equipment availability', 'Review ethical requirements', 'Estimate research timeline'] },
    5: {
      focus: 'Research methodology',
      description: 'Design the methodology, experiments and analysis plan.',
      checklist: ['Define hypotheses', 'Design experiments or study protocol', 'Plan statistical analysis'],
    },
    8: { focus: 'Experimentation', checklist: ['Conduct experiments', 'Record data systematically', 'Maintain a lab notebook'] },
    9: { focus: 'Data analysis', checklist: ['Analyse results', 'Validate against hypotheses', 'Draft the research paper'] },
  },
  Healthcare: {
    1: { checklist: ['Consult clinicians or health workers', 'Review patient-impact evidence', 'Write a final problem statement'] },
    3: { checklist: ['Review regulatory and privacy requirements', 'Assess clinical feasibility', 'Estimate cost of prototype'] },
    5: {
      focus: 'Clinical workflow design',
      description: 'Design the solution around clinical workflows, safety and data privacy.',
      checklist: ['Map the clinical workflow', 'Define data privacy safeguards', 'Design the prototype'],
    },
    8: { focus: 'Prototype development', checklist: ['Build the prototype', 'Document safety considerations', 'Prepare for validation'] },
    9: { focus: 'Clinical validation', checklist: ['Validate with health professionals', 'Measure accuracy or outcomes', 'Document limitations'] },
  },
  Business: {
    1: { focus: 'Market problem', checklist: ['Interview potential customers', 'Analyse competitors', 'Write a final problem statement'] },
    3: { checklist: ['Estimate market size', 'Draft a basic financial model', 'Identify regulatory requirements'] },
    5: {
      focus: 'Business model',
      description: 'Define the business model, revenue streams and go-to-market plan.',
      checklist: ['Complete a business model canvas', 'Define pricing and revenue streams', 'Plan go-to-market'],
    },
    8: { focus: 'MVP build', checklist: ['Build a minimum viable product', 'Onboard first pilot customers', 'Track key metrics'] },
    9: { focus: 'Market validation', checklist: ['Measure customer traction', 'Collect customer feedback', 'Refine the value proposition'] },
  },
}

let counter = 0
const uid = () => `c${Date.now().toString(36)}${(counter++).toString(36)}`

export function buildRoadmap(domain: Domain, completedThrough = -1): RoadmapStage[] {
  const overrides = DOMAIN_OVERRIDES[domain]
  return STAGE_TITLES.map((title, index) => {
    const tpl = { ...BASE[index], ...(overrides[index] ?? {}) }
    const done = index <= completedThrough
    return {
      index,
      title,
      focus: tpl.focus,
      description: tpl.description,
      objectives: tpl.objectives,
      checklist: tpl.checklist.map((text) => ({ id: uid(), text, done })),
      resources: tpl.resources,
      notes: '',
      mentorFeedback: '',
      completed: done,
      mentorReview: index === 4 || index === 9 || index === 10,
    }
  })
}

export function roadmapProgress(stages: RoadmapStage[]) {
  const items = stages.flatMap((s) => s.checklist)
  if (items.length === 0) return 0
  return Math.round((items.filter((i) => i.done).length / items.length) * 100)
}

export function currentStageIndex(stages: RoadmapStage[]) {
  const idx = stages.findIndex((s) => !s.completed)
  return idx === -1 ? stages.length - 1 : idx
}
