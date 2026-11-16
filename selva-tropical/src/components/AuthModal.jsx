import { useState } from 'react';
import {
  Modal,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Text,
  Alert,
  Anchor,
  Group,
  ThemeIcon,
  Box,
} from '@mantine/core';
import { IconLock, IconUserPlus, IconShieldCheck } from '@tabler/icons-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { useAuthStore } from '../store/useAuthStore';

export default function AuthModal() {
  const { authModalOpen, closeAuthModal } = useAuthStore();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name });
        await setDoc(doc(db, 'users', cred.user.uid), {
          uid: cred.user.uid,
          name,
          email,
          role: 'customer',
          createdAt: serverTimestamp(),
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      closeAuthModal();
      setName('');
      setEmail('');
      setPassword('');
    } catch {
      setError('Verifica tus credenciales o intenta con otro correo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={authModalOpen}
      onClose={closeAuthModal}
      withCloseButton
      centered
      radius="xl"
      size="md"
      title={
        <Group gap="sm">
          <ThemeIcon size={38} radius="lg" variant="light" color="teal">
            {isRegister ? <IconUserPlus size={20} /> : <IconLock size={19} />}
          </ThemeIcon>
          <Box>
            <Text fw={800} size="md" lh={1.2}>
              {isRegister ? 'Crea tu cuenta' : 'Bienvenido de nuevo'}
            </Text>
            <Text size="xs" c="dimmed" fw={500}>
              {isRegister ? 'Selva Tropical · Medicina Natural' : 'Ingresa para continuar tu pedido'}
            </Text>
          </Box>
        </Group>
      }
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="sm">
          {error && (
            <Alert color="red" radius="md" variant="light">
              <Text size="xs">{error}</Text>
            </Alert>
          )}

          {isRegister && (
            <TextInput
              label="Nombre completo"
              placeholder="Ej. Andrea Loor"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              radius="md"
              size="md"
            />
          )}

          <TextInput
            label="Correo electrónico"
            placeholder="correo@ejemplo.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            radius="md"
            size="md"
          />

          <PasswordInput
            label="Contraseña"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            radius="md"
            size="md"
          />

          <Button
            type="submit"
            color="teal"
            variant="gradient"
            gradient={{ from: 'teal.7', to: 'green.5', deg: 120 }}
            loading={loading}
            fullWidth
            size="md"
            mt={4}
          >
            {isRegister ? 'Crear mi cuenta' : 'Entrar'}
          </Button>

          <Group justify="center" gap={5} mt={2}>
            <IconShieldCheck size={13} color="#12a97a" />
            <Text size="10px" c="dimmed" fw={600}>
              Tus datos están protegidos y solo se usan para tu pedido.
            </Text>
          </Group>

          <Text size="xs" ta="center" c="dimmed">
            {isRegister ? '¿Ya tienes cuenta?' : '¿Aún no tienes cuenta?'}{' '}
            <Anchor
              component="button"
              type="button"
              fw={700}
              c="teal.7"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
            >
              {isRegister ? 'Inicia sesión' : 'Regístrate aquí'}
            </Anchor>
          </Text>
        </Stack>
      </form>
    </Modal>
  );
}
