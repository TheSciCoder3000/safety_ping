    import React, { useState } from 'react';
    import { Button, Drawer, TextField } from '@mui/material';
    import "../assets/css/CreatePost.css";
    import SendIcon from '@mui/icons-material/Send';
    import Select from '@mui/material/Select';
    import MenuItem from '@mui/material/MenuItem';
    import FormControl from '@mui/material/FormControl';
    import InputLabel from '@mui/material/InputLabel';
    const PostContainer = () => {
        const [open, setOpen] = useState(false);
        const [report,setReport] = useState("");
        const [category,setCategory] = useState("");

        const handleReportChange = (event) => {
            setReport(event.target.value);
        };

        const handleCategoryChange = (event) => {
            setCategory(event.target.value);
        };

        const toggleDrawer = (newOpen) => {
            setOpen(newOpen);
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
                        />
                        <TextField 
                            className='postInput'
                            multiline
                            rows={4}
                            
                            id="demo-helper-text-misaligned-no-helper" 
                            label="What's the situation?"
                        />

                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Type of Report</InputLabel>
                            <Select 
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={report}
                            label="Type of Report"
                            onChange={handleReportChange}>
                                <MenuItem value={0}>SOS/Emergencies</MenuItem>
                                <MenuItem value={1}>Hazards</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Categories</InputLabel>
                            <Select 
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={category}
                            label="Categories"
                            onChange={handleCategoryChange}>
                                <MenuItem value={0}>Road Related</MenuItem>
                                <MenuItem value={1}>Flooding</MenuItem>
                                <MenuItem value={2}>Stranded</MenuItem>
                                <MenuItem value={3}>Medical Related</MenuItem>
                            </Select>
                        </FormControl>

                        <Button 
                            variant="contained" 
                            endIcon={<SendIcon />}
                            className='postSubmit'
                            onClick={() => toggleDrawer(false)}
                        >
                            Post
                        </Button>
                    </div>
                </Drawer>
            </div>
        );
    };

    export default PostContainer;
