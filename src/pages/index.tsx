import { useContext } from 'react';
import { Flex, Button, Stack, FormLabel, FormControl } from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Input } from '../components/Form/Input';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { AuthContext } from '../contexts/AuthContext';

type SignInFormData = {
  email: string;
  password: string;
};

const signInFormSchema = yup.object().shape({
  email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
  password: yup.string().required('Senha obrigatória'),
});

export default function SignIn() {
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(signInFormSchema)
  });

  const { signIn, isAuthenticated } = useContext(AuthContext);

  const { errors } = formState;

  const handleSignIn: SubmitHandler<SignInFormData> = async (values) => {
    await new Promise(resolve => setTimeout(resolve, 2000));

    await signIn(values);
  }

  return (
    <Flex
      w="100vw"
      h="100vh"
      align="center"
      justify="center"
    >
      <Flex
        as="form"
        width="100%"
        maxWidth={360}
        bg="gray.800"
        p="8"
        borderRadius={8}
        flexDir="column"
        onSubmit={handleSubmit(handleSignIn)}
      >
        <Stack spacing="4">
          <FormControl>
            <FormLabel id="label-email" htmlFor="email">E-mail</FormLabel>
            <Input
              id="email"
              name="email"
              type="email"
              error={errors.email}
              {...register('email')}
            />
          </FormControl>

          <FormControl>
            <FormLabel id="label-password" htmlFor="password">Senha</FormLabel>
            <Input
              id="password"
              name="password"
              type="password"
              error={errors.password}
              {...register('password')}
            />
          </FormControl>
        </Stack>

        <Button
          type="submit"
          mt="6"
          colorScheme="pink"
          size="lg"
          isLoading={formState.isSubmitting}
        >
          Entrar
        </Button>
      </Flex>
    </Flex>
  )
}