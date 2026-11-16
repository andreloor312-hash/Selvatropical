import { Group, Text, Image } from '@mantine/core';
import logoImg from '../assets/logo.png';

export default function BrandLogo({ size = 'md' }) {
  const iconHeight = size === 'lg' ? 48 : 40;
  const titleSize = size === 'lg' ? '1.35rem' : '1.15rem';

  return (
    <Group gap="xs" wrap="nowrap" style={{ userSelect: 'none' }}>
      <Image
        src={logoImg}
        alt="Selva Tropical"
        h={iconHeight}
        w="auto"
        fit="contain"
        radius="sm"
      />

      <div style={{ lineHeight: 1.1 }}>
        <Text fw={800} style={{ fontSize: titleSize, letterSpacing: '-0.4px' }} c="dark.8">
          Selva<Text span c="teal.7" inherit>Tropical</Text>
        </Text>
        <Text size="10px" fw={600} tt="uppercase" c="dimmed" style={{ letterSpacing: '1.2px' }}>
          Medicina Natural
        </Text>
      </div>
    </Group>
  );
}