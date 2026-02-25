import Link from 'next/link';

import FigmaCheckboxShowcase from '@/app/examples/components/FigmaCheckboxShowcase';
import InputShowcase from '@/app/examples/components/InputShowcase';

import AutocompleteShowcase from './components/AutocompleteShowcase';
import AvatarBadgeChipShowcase from './components/AvatarBadgeChipShowcase';
import ButtonShowcase from './components/ButtonShowcase';
import CheckboxShowcase from './components/CheckboxShowcase';
import DatePickerShowcase from './components/DatePickerShowcase';
import FABShowcase from './components/FABShowcase';
import FeedbackShowcase from './components/FeedbackShowcase';
import IconShowcase from './components/IconShowcase';
import ImageShowcase from './components/ImageShowcase';
import ModalShowcase from './components/ModalShowcase';
import SelectShowcase from './components/SelectShowcase';
import TableShowcase from './components/TableShowcase';
import TextFieldShowcase from './components/TextFieldShowcase';

function Section({ title }: { title: string }) {
  return <h2 className="text-2xl font-bold mt-14 mb-6 text-black dark:text-white">{title}</h2>;
}

export default function ExamplesPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-blue-600 hover:underline text-sm mb-6 inline-block">
          &larr; Back to Home
        </Link>

        <h1 className="text-3xl font-bold mb-2 text-black dark:text-white">Component Examples</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-10">
          Custom Tailwind components + Material UI components
        </p>

        {/* ── Custom components ── */}
        <Section title="Button" />
        <ButtonShowcase />

        <Section title="Date Picker" />
        <DatePickerShowcase />

        <Section title="Modal" />
        <ModalShowcase />

        <Section title="Image" />
        <ImageShowcase />

        {/* ── MUI components ── */}
        <Section title="Custom MUI input field with label" />
        <InputShowcase />

        <Section title="MUI · Autocomplete & Country Select" />
        <AutocompleteShowcase />

        <Section title="MUI · Text Field" />
        <TextFieldShowcase />

        <Section title="MUI · Select, Radio & Number Input" />
        <SelectShowcase />

        <Section title="Figma checkbox using MUI" />
        <FigmaCheckboxShowcase />

        <Section title="MUI · Checkbox" />
        <CheckboxShowcase />

        <Section title="MUI · Avatar, Badge & Chip" />
        <AvatarBadgeChipShowcase />

        <Section title="MUI · Icons" />
        <IconShowcase />

        <Section title="MUI · Table" />
        <TableShowcase />

        <Section title="MUI · Tooltip, Progress & Snackbar" />
        <FeedbackShowcase />

        <Section title="MUI · Floating Action Button" />
        <FABShowcase />
      </div>
    </div>
  );
}
