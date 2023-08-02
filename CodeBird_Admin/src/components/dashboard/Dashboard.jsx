import Navbar from "../navbar/Navbar";
import UserCard from "../cards/UserCard";
import { Stack, Heading, Text, Box } from "@chakra-ui/react";


const Dashboard = () => {
  return (
    <div>
      <Navbar />
      <Box>
        <Heading textAlign={'center'}>
           All Users (10)
        </Heading>
      </Box>
      <Box display={"flex"} justifyContent={"center"}>
        <Stack
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          flexWrap={"wrap"}
          spacing={5}
          width={1200}
        >
          <UserCard />
          <UserCard />
          <UserCard />
          <UserCard />
          <UserCard />
          <UserCard />
        </Stack>
      </Box>
    </div>
  );
};

export default Dashboard;
