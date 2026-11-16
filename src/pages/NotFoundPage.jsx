import { Link } from 'react-router-dom';
import { Container, Title, Text, Button, Group, Stack, ThemeIcon, Paper } from '@mantine/core';
import { IconLeafOff, IconHome } from '@tabler/icons-react';

export default function NotFoundPage() {
  return (
    <Container size="sm" py={80}>
      <Paper p="xl" radius="md" withBorder shadow="sm" ta="center">
        <Stack align="center" gap="md">
          <ThemeIcon size={72} radius="xl" variant="light" color="teal">
            <IconLeafOff size={38} />
          </ThemeIcon>

          <Text fw={900} c="teal" style={{ fontSize: '4rem', lineHeight: 1 }}>
            404
          </Text>

          <Title order={2}>Ruta no encontrada en la selva</Title>

          <Text c="dimmed" maw={420}>
            La página que buscas no existe, fue movida o el enlace está incompleto. Vuelve al catálogo principal para explorar nuestros productos naturales.
          </Text>

          <Group mt="md">
            <Button
              component={Link}
              to="/"
              size="md"
              color="teal"
              leftSection={<IconHome size={18} />}
            >
              Volver al Catálogo
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
}