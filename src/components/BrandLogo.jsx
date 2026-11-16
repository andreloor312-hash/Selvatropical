import { Group, Text, Image } from '@mantine/core';
import logoImg from '../assets/Logo.png';

export default function BrandLogo({ size = 'md' }) {
  const iconHeight = size === 'lg' ? 46 : 38;
  const titleSize = size === 'lg' ? '1.35rem' : '1.12rem';

  return (
    <Group gap={10} wrap="nowrap" style={{ userSelect: 'none' }}>
      <Image
        src={logoImg}
        alt="Selva Tropical"
        h={iconHeight}
        w="auto"
        fit="contain"
        style={{ filter: 'drop-shadow(0 4px 10px rgba(6, 51, 38, 0.18))' }}
      />

      <div style={{ lineHeight: 1.05 }}>
        <Text
          fw={800}
          style={{ fontSize: titleSize, letterSpacing: '-0.045em' }}
          c="dark.8"
        >
          Selva
          <Text span c="teal.7" inherit>
            Tropical
          </Text>
        </Text>
        <Text
          size="9px"
          fw={700}
          tt="uppercase"
          c="dimmed"
          style={{ letterSpacing: '1.8px' }}
        >
          Medicina Natural
        </Text>
      </div>
    </Group>
  );
}
