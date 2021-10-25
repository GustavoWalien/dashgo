import { Box, Flex, Avatar, Text, HStack, Icon } from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { FiPower } from "react-icons/fi";
import { AuthContext } from "../../contexts/AuthContext";
import { apiAuth } from "../../services/apiClient";
import { useCan } from "../../services/hooks/useCan";

interface ProfileProps {
  showProfileData?: boolean;
}

export function Profile({ showProfileData = true }: ProfileProps) {
  const { user, signOut, isAuthenticated } = useContext(AuthContext)
  const userCanSeeMetrics = useCan({
    permissions: ['metrics:list']
  })

  useEffect(() => {
    apiAuth.get('/me').then(response => console.log(response))
  }, [])

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

      <HStack
        spacing={["6", "8"]} 
        py="1"
        color="gray.300"
        borderColor="gray.700"
      >
        <Icon
          ml="4"
          onClick={signOut}
          as={FiPower}
          fontSize="25"
          cursor="pointer"
          color="gray.300"
        />
      </HStack>
    </Flex>
  );
}