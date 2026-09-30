import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  CodeXml,
  Compass,
  Database,
  Copy,
  Download,
  Dumbbell,
  Film,
  Flag,
  Gamepad2,
  GitBranch as Github,
  GraduationCap,
  ContactRound as Linkedin,
  Mail,
  Menu,
  Moon,
  Sun,
  Terminal,
  Users,
  Wrench,
  X,
} from "lucide-react";

const icons = {
  activity: Activity,
  arrowDown: ArrowDown,
  arrowRight: ArrowRight,
  arrowUp: ArrowUp,
  arrowUpRight: ArrowUpRight,
  briefcase: BriefcaseBusiness,
  check: Check,
  chevronRight: ChevronRight,
  code: CodeXml,
  compass: Compass,
  database: Database,
  copy: Copy,
  download: Download,
  dumbbell: Dumbbell,
  film: Film,
  flag: Flag,
  gamepad: Gamepad2,
  github: Github,
  graduation: GraduationCap,
  linkedin: Linkedin,
  mail: Mail,
  menu: Menu,
  moon: Moon,
  people: Users,
  sun: Sun,
  terminal: Terminal,
  tools: Wrench,
  x: X,
};

export function Icon({
  name,
  className = "",
  size = 20,
}: {
  name: string;
  className?: string;
  size?: number;
}) {
  const Component = icons[name as keyof typeof icons] ?? CodeXml;
  return (
    <Component
      aria-hidden="true"
      size={size}
      strokeWidth={1.6}
      className={className}
    />
  );
}
