import { join } from 'node:path';

// Repo scripts load .env.local explicitly; Next does this automatically but
// tsx does not.
async function loadEnv() {
  try {
    process.loadEnvFile(join(process.cwd(), '.env.local'));
  } catch {
    console.warn('No .env.local found; relying on the parent environment');
  }
}

async function main() {
  await loadEnv();

  if (!process.env.REPLICATE_API_TOKEN) {
    console.error('❌ REPLICATE_API_TOKEN is not set');
    process.exitCode = 1;
    return;
  }

  const { vectorizeImage, upscaleImage, removeBackground } = await import(
    '../src/lib/ai/replicate-client'
  );

  // Replicate fetches the input itself, so it must be reachable without auth.
  const testImageUrl =
    process.env.REPLICATE_TEST_IMAGE_URL ??
    'https://replicate.delivery/pbxt/Ho28olmw8dnOffOz7yjuPK6UGsOPqFUfpCnq1ur8zaAKxiPH/animal-1.jpeg';

  let failures = 0;

  console.log('→ removeBackground');
  try {
    const result = await removeBackground(testImageUrl);
    console.log('✅ removeBackground', result.outputUrl);
  } catch (error) {
    failures += 1;
    console.error('❌ removeBackground failed:', error instanceof Error ? error.message : error);
  }

  console.log('→ upscaleImage (2x)');
  try {
    const result = await upscaleImage(testImageUrl, 2);
    console.log('✅ upscaleImage', result.outputUrl, `scale=${result.scale}`);
  } catch (error) {
    failures += 1;
    console.error('❌ upscaleImage failed:', error instanceof Error ? error.message : error);
  }

  console.log('→ vectorizeImage');
  try {
    const result = await vectorizeImage(testImageUrl);
    console.log('✅ vectorizeImage');
    console.log('   SVG length:', result.svg.length);
    console.log('   output URL:', result.outputUrl);
    console.log('   starts with:', result.svg.slice(0, 60).replace(/\n/g, ' '));
  } catch (error) {
    failures += 1;
    console.error('❌ vectorizeImage failed:', error instanceof Error ? error.message : error);
  }

  if (failures > 0) {
    console.error(`\n${failures} operation(s) failed`);
    process.exitCode = 1;
  } else {
    console.log('\n✅ Replicate integration works');
  }
}

main().catch((error) => {
  console.error('❌ Replicate test crashed:', error);
  process.exitCode = 1;
});