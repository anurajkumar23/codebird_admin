import { Heading, Box, Button } from "@chakra-ui/react";
import Navbar from "../navbar/Navbar";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { BiSolidImageAdd } from "react-icons/bi";
import { RiGalleryFill } from "react-icons/ri";
import { Input, FormControl, FormLabel } from "@chakra-ui/react";
// import Eventcard from "../cards/Eventcard";
import { useState , useEffect } from "react";
// import uploadpic from "../../assets/upload4.jpg";
import uploadpic from "../../assets/user.png";
import MemberCard from "../cards/MemberCard";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
// import url from "../helper/helper";


const CoreTeam = () => {
  const [data,setData] = useState([]);
  useEffect(() => {
    axios
      .get(`https://codebird-admin-server.vercel.app/api/coreTeam`, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [user, setUser] = useState({
    name: "",
    position: "",
    branch : "",
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter:"",
    profile:""
  });
  const addMember = async ()=>{
    if (
      !user.position ||
      !user.branch||
      
      !user.name
    ) {
      toast.error("Please fill all required fields!");
    } else {
      try {
        const res = await axios.post(`https://codebird-admin-server.vercel.app/api/coreTeam`, user, {
          withCredentials: true,
        });
        console.log(res);
        toast.success("Add Member Successfully!");
        setUser({
          ...user,
          name: "",
          position: "",
          branch: "",
          facebook: "",
          instagram: "",
          linkedin: "",
          twitter:""
        });
      } catch (error) {
        console.log(error);
        toast.error("Register Failed!");
      }
    }

  }
const [file, setFile] = useState();

  const handelUser = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

   const onUpload = async (e) => {
     const base64 = await convertToBase64(e.target.files[0]);
     setFile(base64);
     setUser({ ...user, profile: base64 });
   };
   function convertToBase64(file) {
     return new Promise((resolve, reject) => {
       const fileReader = new FileReader();
       fileReader.readAsDataURL(file);

       fileReader.onload = () => {
         resolve(fileReader.result);
       };

       fileReader.onerror = (error) => {
         reject(error);
       };
     });
   }
  return (
    <Box>
      <Navbar />
      <Box>
        <Heading fontFamily="'Ubuntu', sans-serif;" textAlign={"center"}>
          Core Team
        </Heading>
        <Box width="80%" margin="0 auto">
          <Tabs align="end" variant="enclosed">
            <TabList>
              <Tab
                display={"flex"}
                gap={"1"}
                justifyContent={"center"}
                alignItems={"center"}
                fontFamily="'Ubuntu', sans-serif;"
              >
                <RiGalleryFill />
                Existing CoreTeam Member
              </Tab>

              <Tab
                display={"flex"}
                gap={"1"}
                justifyContent={"center"}
                alignItems={"center"}
                fontFamily="'Ubuntu', sans-serif;"
              >
                <BiSolidImageAdd />
                Create CoreTeam Member
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  gap={10}
                  flexWrap={"wrap"}
                >{
                  data.map((element,key)=>{
                    return (
                      <MemberCard
                        key={key}
                        name={element.name}
                        branch={element.branch}
                        position={element.clubPosition}
                        facebook={element.facebook}
                        linkedin={element.linkedin}
                        twitter={element.twitter}
                        profile={element.pimg}
                      />
                    );

                  }
                  )
                }  
                </Box>
              </TabPanel>

              <TabPanel>
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  gap={6}
                  justifyContent={"center"}
                  alignItems={"center"}
                  borderRadius="rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
                >
                  <FormControl width="100%">
                    <div className="posterevent">
                      <FormLabel htmlFor="imgInput">
                        <img
                          className="profilimg"
                          src={file || uploadpic}
                          alt="img"
                        />
                      </FormLabel>
                      <input id="imgInput" onChange={onUpload} type="file" />
                    </div>
                    <FormLabel>Enter Name</FormLabel>
                    <Input
                      name="name"
                      value={user.name}
                      onChange={handelUser}
                      focusBorderColor="#675cff"
                      borderRadius={"20"}
                      border="2px solid #675cff "
                      type="text"
                    />
                    <FormLabel>Enter Position</FormLabel>
                    <Input
                      name="position"
                      value={user.position}
                      onChange={handelUser}
                      focusBorderColor="#675cff"
                      borderRadius={"20"}
                      border="2px solid #675cff "
                      type="text"
                    />
                     <FormLabel>Enter Branch</FormLabel>
                    <Input
                      name="branch"
                      value={user.branch}
                      onChange={handelUser}
                      focusBorderColor="#675cff"
                      borderRadius={"20"}
                      border="2px solid #675cff "
                      type="text"
                    />
                    
                    <FormLabel>Enter Facebook</FormLabel>
                    <Input
                      name="facebook"
                      value={user.facebook}
                      onChange={handelUser}
                      focusBorderColor="#675cff"
                      borderRadius={"20"}
                      border="2px solid #675cff "
                      type="text"
                    />
                    <FormLabel>Enter Instagram</FormLabel>
                    <Input
                      name="instagram"
                      value={user.instagram}
                      onChange={handelUser}
                      focusBorderColor="#675cff"
                      borderRadius={"20"}
                      border="2px solid #675cff "
                      type="text"
                    />
                    <FormLabel>Enter Linkedin</FormLabel>
                    <Input
                      name="linkedin"
                      value={user.linkedin}
                      onChange={handelUser}
                      focusBorderColor="#675cff"
                      borderRadius={"20"}
                      border="2px solid #675cff "
                      type="text"
                    />
                    <FormLabel>Enter Twitter</FormLabel>
                    <Input
                      name="twitter"
                      value={user.twitter}
                      onChange={handelUser}
                      focusBorderColor="#675cff"
                      borderRadius={"20"}
                      border="2px solid #675cff "
                      type="text"
                    />
                  </FormControl>
                  <button
                    onClick={addMember}
                    className="eventBtn"
                  >
                    Create Member
                  </button>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
      <Toaster position="top-center" reverseOrder={false} />
    </Box>
  );
};

export default CoreTeam;
