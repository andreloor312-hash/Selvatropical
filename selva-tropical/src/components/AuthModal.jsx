import { useState } from 'react';
import { Modal, TextInput, PasswordInput, Button, Stack, Text, Alert, Anchor } from '@mantine/core';
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
    } catch (err) {
      setError('Verifica tus credenciales o intenta con otro correo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={authModalOpen}
      onClose={closeAuthModal}
      title={isRegister ? 'Crear cuenta en Selva Tropical' : 'Iniciar sesión'}
      centered
    >
      <form onSubmit={handleSubmit}>
        <Stack>
          {error && <Alert color="red">{error}</Alert>}

          {isRegister && (
            <TextInput
              label="Nombre completo"
              placeholder="Ej. Andrea Loor"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <TextInput
            label="Correo electrónico"
            placeholder="correo@ejemplo.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <PasswordInput
            label="Contraseña"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" color="teal" loading={loading} fullWidth>
            {isRegister ? 'Registrarme' : 'Entrar'}
          </Button>

          <Text size="xs" ta="center" c="dimmed">
            {isRegister ? '¿Ya tienes cuenta?' : '¿Aún no tienes cuenta?'}{' '}
            <Anchor component="button" type="button" onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? 'Inicia sesión' : 'Regístrate aquí'}
            </Anchor>
          </Text>
        </Stack>
      </form>
    </Modal>
  );
}