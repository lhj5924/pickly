import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  const isDev = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

  if (!isDev) {
    const svgData = readFileSync(join(process.cwd(), 'public/favicon.svg'));
    const svgBase64 = `data:image/svg+xml;base64,${svgData.toString('base64')}`;

    return new ImageResponse(<img src={svgBase64} width={32} height={32} />, { ...size });
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: '#FAE100',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
          fontWeight: 'bold',
        }}
      >
        P
      </div>
    ),
    { ...size },
  );
}
