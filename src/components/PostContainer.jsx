    import React, { useState } from 'react';
    import { Button, Drawer, TextField } from '@mui/material';
    import "../assets/css/CreatePost.css";
    import SendIcon from '@mui/icons-material/Send';
    import Select from '@mui/material/Select';
    import MenuItem from '@mui/material/MenuItem';
    import FormControl from '@mui/material/FormControl';
    import InputLabel from '@mui/material/InputLabel';
    import { createUserPin } from '../api/firestore';
    import { useAuth } from '../components/contexts/AuthContext';
   
    const PostContainer = () => {
        const { currentUser } = useAuth();

        const [open, setOpen] = useState(false);
        const [report,setReport] = useState("");
        const [category,setCategory] = useState("");
        const [title, setTitle] = useState("");
        const [description, setDescription] = useState("");
        const handleReportChange = (event) => {
            setReport(event.target.value);
        };

        const handleCategoryChange = (event) => {
            setCategory(event.target.value);
        };

        const toggleDrawer = (newOpen) => {
            setOpen(newOpen);
        };

        const handleSubmit = async () => {
            if (!currentUser) {
                alert("User is not logged in!");
                return;
            }
        
            if (!title || !description || !report || !category) {
                alert("Please fill in all fields");
                return;
            }
        
            try {
                const pinId = await createUserPin(currentUser.uid, title, description, report, category);
                alert(`Post created successfully! ID: ${pinId}`);
                toggleDrawer(false);
        
                // Reset form fields
                setTitle("");
                setDescription("");
                setReport("");
                setCategory("");
            } catch (error) {
                console.error("Error creating post:", error);
                alert("Failed to create post.");
            }
        };
        return (
            <div className="createPostContainer">
                <TextField 
                    className='createPostBtn'
                    placeholder="What's the situation?"
                    fullWidth
                    slotProps={{ input: { readOnly: true } }}
                    onClick={() => toggleDrawer(true)}
                />
                <Drawer 
                    anchor='bottom'
                    open={open} 
                    onClose={() => toggleDrawer(false)} 
                    className='createPostDrawer'
                > 
                    <div className="postContent">
                        <TextField
                            className='postInput'
                            id="demo-helper-text-misaligned-no-helper"
                            label="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)} 
                        />
                        <TextField 
                            className='postInput'
                            multiline
                            rows={4}
                            id="demo-helper-text-misaligned-no-helper" 
                            label="What's the situation?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Type of Report</InputLabel>
                            <Select 
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={report}
                            label="Type of Report"
                            onChange={(e) => setReport(e.target.value)}>
                                <MenuItem value={"SOS"}>SOS/Emergencies</MenuItem>
                                <MenuItem value={"Hazards"}>Hazards</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Categories</InputLabel>
                            <Select 
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={category}
                            label="Categories"
                            onChange={(e) => setCategory(e.target.value)}>
                                <MenuItem value={"Road Related"}>Road Related</MenuItem>
                                <MenuItem value={"Flooding"}>Flooding</MenuItem>
                                <MenuItem value={"Stranded"}>Stranded</MenuItem>
                                <MenuItem value={"Medical Related"}>Medical Related</MenuItem>
                            </Select>
                        </FormControl>

                        <Button 
                            variant="contained" 
                            endIcon={<SendIcon />}
                            className='postSubmit'
                            onClick={handleSubmit}
                        >
                            Post
                        </Button>
                    </div>
                </Drawer>
            </div>
        );
    };

    export default PostContainer;
