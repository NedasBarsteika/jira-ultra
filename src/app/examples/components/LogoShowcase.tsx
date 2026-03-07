import CustomImage from '@/components/utils/images/Image';

export default function ImageShowcase() {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Basic Usage</h2>
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <p className="text-sm text-zinc-500 mb-2">full_logo</p>
          <CustomImage src="/images/full_logo.png" alt="Iterova" width={200} height={150} />
        </div>
        <div>
          <p className="text-sm text-zinc-500 mb-2">full_logo_trimmed</p>
          <CustomImage src="/images/full_logo_trimmed.png" alt="Iterova" width={200} height={150} />
        </div>
        <div>
          <p className="text-sm text-zinc-500 mb-2">full_logo_57x32</p>
          <CustomImage src="/images/full_logo_57x32.png" alt="Iterova" width={57} height={32} />
        </div>
        <div>
          <p className="text-sm text-zinc-500 mb-2">logo_512x512</p>
          <CustomImage src="/images/logo_512x512.png" alt="Iterova" width={512} height={512} />
        </div>
        <div>
          <p className="text-sm text-zinc-500 mb-2">logo_192x192</p>
          <CustomImage src="/images/logo_192x192.png" alt="Iterova" width={192} height={192} />
        </div>
        <div>
          <p className="text-sm text-zinc-500 mb-2">logo_32x32</p>
          <CustomImage src="/images/logo_32x32.png" alt="Iterova" width={32} height={32} />
        </div>
      </div>
    </section>
  );
}
