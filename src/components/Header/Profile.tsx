import { Box, Flex, Avatar, Text } from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { setupAPIClient } from "../../services/apiAuth";
import { withSSRAuth } from "../../utils/withSSRAuth";
import { apiAuth } from "../../services/apiClient";

interface ProfileProps {
  showProfileData?: boolean;
}

export function Profile({ showProfileData = true }: ProfileProps) {
  const { user } = useContext(AuthContext)

  useEffect(() => {
    apiAuth.get('/me').then(response => {
      console.log('entrou')
      console.log(response)
    }).catch(err => console.error(err))
  })
  
  return (
    <Flex align="center">
      {showProfileData && (
        <Box mr="4" textAlign="right">
          <Text>{user?.email == null ? 'Gustavo' : user?.email}</Text>
          <Text
            color="gray.300"
            fontSize="small"
          >
            {user?.email == null ? 'gustavowalien@gmail.com' : user?.email}
          </Text>
        </Box>
      )}

      <Avatar size="md" name="Gustavo Martins" />
    </Flex>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx)
  const reponse = await apiClient.get('/me')

  console.log(reponse.data)

  return {
    props: {}
  }
})