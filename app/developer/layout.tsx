import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';

export default function DeveloperLayout({ children }: LayoutProps<'/developer'>) {
  return <HomeLayout {...baseOptions()}>{children}</HomeLayout>;
}
