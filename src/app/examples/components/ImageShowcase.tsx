'use client';

import CustomImage from '@/components/utils/images/Image';

export default function ImageShowcase() {
  return (
    <div className="flex flex-col gap-10">
      {/* Basic Usage */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Basic Usage</h2>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <p className="text-sm text-zinc-500 mb-2">Default (cover)</p>
            <CustomImage src="/images/art.png" alt="Art sample" width={200} height={150} />
          </div>
          <div>
            <p className="text-sm text-zinc-500 mb-2">Contain</p>
            <CustomImage
              src="/images/art.png"
              alt="Art sample contain"
              width={200}
              height={150}
              fit="contain"
              className="bg-zinc-100 dark:bg-zinc-800"
            />
          </div>
          <div>
            <p className="text-sm text-zinc-500 mb-2">Fill</p>
            <CustomImage
              src="/images/art.png"
              alt="Art sample fill"
              width={200}
              height={150}
              fit="fill"
            />
          </div>
        </div>
      </section>

      {/* Rounded Variants */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Rounded Variants</h2>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <p className="text-sm text-zinc-500 mb-2">none</p>
            <CustomImage
              src="/images/art.png"
              alt="No rounding"
              width={120}
              height={120}
              rounded="none"
            />
          </div>
          <div>
            <p className="text-sm text-zinc-500 mb-2">sm</p>
            <CustomImage
              src="/images/art.png"
              alt="Small rounding"
              width={120}
              height={120}
              rounded="sm"
            />
          </div>
          <div>
            <p className="text-sm text-zinc-500 mb-2">md</p>
            <CustomImage
              src="/images/art.png"
              alt="Medium rounding"
              width={120}
              height={120}
              rounded="md"
            />
          </div>
          <div>
            <p className="text-sm text-zinc-500 mb-2">lg</p>
            <CustomImage
              src="/images/art.png"
              alt="Large rounding"
              width={120}
              height={120}
              rounded="lg"
            />
          </div>
          <div>
            <p className="text-sm text-zinc-500 mb-2">full</p>
            <CustomImage
              src="/images/art.png"
              alt="Full rounding"
              width={120}
              height={120}
              rounded="full"
            />
          </div>
        </div>
      </section>

      {/* Aspect Ratio */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
          Aspect Ratio (responsive container)
        </h2>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-zinc-500 mb-2">16 / 9</p>
            <div className="max-w-md">
              <CustomImage src="/images/art.png" alt="16:9 art" aspectRatio="16/9" rounded="md" />
            </div>
          </div>
          <div>
            <p className="text-sm text-zinc-500 mb-2">4 / 3</p>
            <div className="max-w-sm">
              <CustomImage src="/images/art.png" alt="4:3 art" aspectRatio="4/3" rounded="md" />
            </div>
          </div>
          <div>
            <p className="text-sm text-zinc-500 mb-2">1 / 1 (square)</p>
            <div className="max-w-[200px]">
              <CustomImage src="/images/art.png" alt="Square art" aspectRatio="1/1" rounded="lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Avatar-style */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Avatar Sizes</h2>
        <div className="flex flex-wrap items-center gap-4">
          <div className="text-center">
            <CustomImage
              src="/images/art.png"
              alt="Avatar sm"
              width={32}
              height={32}
              rounded="full"
            />
            <p className="text-xs text-zinc-500 mt-1">32px</p>
          </div>
          <div className="text-center">
            <CustomImage
              src="/images/art.png"
              alt="Avatar md"
              width={48}
              height={48}
              rounded="full"
            />
            <p className="text-xs text-zinc-500 mt-1">48px</p>
          </div>
          <div className="text-center">
            <CustomImage
              src="/images/art.png"
              alt="Avatar lg"
              width={64}
              height={64}
              rounded="full"
            />
            <p className="text-xs text-zinc-500 mt-1">64px</p>
          </div>
          <div className="text-center">
            <CustomImage
              src="/images/art.png"
              alt="Avatar xl"
              width={96}
              height={96}
              rounded="full"
            />
            <p className="text-xs text-zinc-500 mt-1">96px</p>
          </div>
        </div>
      </section>

      {/* Custom className */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
          Custom Styles via className
        </h2>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <p className="text-sm text-zinc-500 mb-2">Shadow</p>
            <CustomImage
              src="/images/art.png"
              alt="Shadow"
              width={160}
              height={120}
              rounded="md"
              className="shadow-lg"
            />
          </div>
          <div>
            <p className="text-sm text-zinc-500 mb-2">Border</p>
            <CustomImage
              src="/images/art.png"
              alt="Border"
              width={160}
              height={120}
              rounded="md"
              className="border-2 border-blue-500"
            />
          </div>
          <div>
            <p className="text-sm text-zinc-500 mb-2">Grayscale</p>
            <CustomImage
              src="/images/art.png"
              alt="Grayscale"
              width={160}
              height={120}
              rounded="md"
              className="grayscale"
            />
          </div>
          <div>
            <p className="text-sm text-zinc-500 mb-2">Hover effect</p>
            <CustomImage
              src="/images/art.png"
              alt="Hover"
              width={160}
              height={120}
              rounded="md"
              className="transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
