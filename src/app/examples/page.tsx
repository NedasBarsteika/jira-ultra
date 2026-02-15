import Link from 'next/link';

import ButtonShowcase from './components/ButtonShowcase';
import DatePickerShowcase from './components/DatePickerShowcase';
import ImageShowcase from './components/ImageShowcase';
import ModalShowcase from './components/ModalShowcase';

export default function ExamplesPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-blue-600 hover:underline text-sm mb-6 inline-block">
          &larr; Back to Home
        </Link>

        <h1 className="text-3xl font-bold mb-8 text-black dark:text-white">Button Examples</h1>

        <ButtonShowcase />

        <h1 className="text-3xl font-bold mt-12 mb-8 text-black dark:text-white">Date Picker</h1>

        <DatePickerShowcase />

        <h1 className="text-3xl font-bold mt-12 mb-8 text-black dark:text-white">Modals</h1>

        <ModalShowcase />

        <h1 className="text-3xl font-bold mt-12 mb-8 text-black dark:text-white">Images</h1>

        <ImageShowcase />
      </div>
    </div>
  );
}
