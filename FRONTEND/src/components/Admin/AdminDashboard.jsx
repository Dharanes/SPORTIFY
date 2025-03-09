import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  CardActionArea,
  Rating,
} from "@mui/material";
import {
  blue,
  orange,
  green,
  red,
  yellow,
  grey,
  purple,
} from "@mui/material/colors";
import BookingsChart from "./BookingsChart";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ApprovalIcon from "@mui/icons-material/Approval";
import EventNoteIcon from "@mui/icons-material/EventNote";
import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../ReduxToolKit/AuthSlice";
import {
  getAllBookings,
  getAllTurfs,
  getApprovedTurf,
  getMostBookedTurf,
  getNumberOfCustomers,
  getNumberOfTurfs,
  getPendingTurf,
  updateStatus,
} from "../../ReduxToolKit/BookingSlice";

const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("analytics"); // Keeps track of the selected content (analytics, turf approval, or bookings)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // api call
  const [turfs, setTurfs] = useState([]);
  const noOfCustomers = useSelector((state) => state.booking.numberOfCustomers);
  const noOfTurfs = useSelector((state) => state.booking.numberOfTurfs);
  const maxBookedTurf = useSelector((state) => state.booking.mostBookedTurf);
  const bookings = useSelector((state) => state.booking.allBookings);
  const pendingTurfs = useSelector((state) => state.booking.pending);
  const approvedTurfs = useSelector((state) => state.booking.approved);
  const analytics = {
    totalBookings: bookings?.length || 0,
  };

  // Calculate number of bookings per day of the week
  const bookingsPerDay = [0, 0, 0, 0, 0, 0, 0]; // Sunday to Saturday

  if (bookings) {
    bookings.forEach((booking) => {
      const bookingDate = new Date(booking.date);
      const dayOfWeek = bookingDate.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
      bookingsPerDay[dayOfWeek] += 1;
    });
  }

  // Calculate total unique users
  const totalUsers = noOfCustomers;

  // Calculate total unique turfs
  const totalTurfs = noOfTurfs;

  const mostBookedTurf = maxBookedTurf;

  // Ensure the value is not null and show a fallback if necessary
  const displayMostBookedTurf = mostBookedTurf ? mostBookedTurf : "Play Mania";

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };
  useEffect(() => {
    if (selectedTab === "turfApproval") {
      dispatch(getPendingTurf());
    } else if (selectedTab === "allTurfs") {
      dispatch(getApprovedTurf());
    }
  }, [selectedTab, dispatch]);

  useEffect(() => {
    if (selectedTab === "turfApproval") {
      setTurfs(pendingTurfs || []);
    } else if (selectedTab === "allTurfs") {
      setTurfs(approvedTurfs || []);
    }
  }, [selectedTab, pendingTurfs, approvedTurfs]);

  useEffect(() => {
    dispatch(getNumberOfCustomers());
    dispatch(getNumberOfTurfs());
    dispatch(getMostBookedTurf());
    dispatch(getAllBookings());
    dispatch(getAllTurfs());
  }, [dispatch]);

  const handleApprove = (id) => {
    dispatch(updateStatus({ id: id, status: "APPROVED" }));
    setTurfs((prevTurfs) =>
      prevTurfs.map((turf) =>
        turf.id === id ? { ...turf, status: "APPROVED" } : turf
      )
    );

    // Remove the turf after 3 seconds
    setTimeout(() => {
      setTurfs((prevTurfs) => prevTurfs.filter((turf) => turf.id !== id));
    }, 3000);
  };

  // Handler for rejecting a turf
  const handleReject = (id) => {
    dispatch(updateStatus({ id: id, status: "REJECTED" }));
    setTurfs((prevTurfs) =>
      prevTurfs.map((turf) =>
        turf.id === id ? { ...turf, status: "REJECTED" } : turf
      )
    );

    // Remove the turf after 3 seconds
    setTimeout(() => {
      setTurfs((prevTurfs) => prevTurfs.filter((turf) => turf.id !== id));
    }, 3000);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Left Panel (Sidebar) */}
      <Drawer
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
            backgroundColor: blue[700],
            color: "white",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <AppBar
          position="static"
          sx={{ backgroundColor: blue[700], boxShadow: 0 }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              Admin Dashboard
            </Typography>
          </Toolbar>
        </AppBar>

        <List>
          <ListItem
            button
            onClick={() => handleTabChange("analytics")}
            sx={{ cursor: "pointer" }}
          >
            <ListItemIcon>
              <AssessmentIcon sx={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText primary="Analytics" sx={{ color: "white" }} />
          </ListItem>
          <ListItem
            button
            onClick={() => handleTabChange("turfApproval")}
            sx={{ cursor: "pointer" }}
          >
            <ListItemIcon>
              <ApprovalIcon sx={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText primary="Turf Approval" sx={{ color: "white" }} />
          </ListItem>
          <ListItem
            button
            onClick={() => handleTabChange("allTurfs")}
            sx={{ cursor: "pointer" }}
          >
            <ListItemIcon>
              <EventNoteIcon sx={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText primary="All Turfs" sx={{ color: "white" }} />
          </ListItem>
          <ListItem
            button
            onClick={() => handleTabChange("allBookings")}
            sx={{ cursor: "pointer" }}
          >
            <ListItemIcon>
              <EventNoteIcon sx={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText primary="All Bookings" sx={{ color: "white" }} />
          </ListItem>
        </List>

        {/* Logout Button at the bottom */}
        <List sx={{ position: "absolute", bottom: 16, width: "100%" }}>
          <ListItem button onClick={handleLogout} sx={{ cursor: "pointer" }}>
            <ListItemIcon>
              <ExitToAppIcon sx={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText primary="Logout" sx={{ color: "white" }} />
          </ListItem>
        </List>
      </Drawer>

      {/* Right Panel (Main Content) */}
      <Box
        sx={{
          flexGrow: 1,
          padding: 3,
          backgroundColor: grey[100],
          overflowY: "auto",
        }}
      >
        {/* Conditional Rendering Based on Selected Tab */}
        {selectedTab === "analytics" && (
          <>
            <Typography
              variant="h4"
              sx={{
                color: blue[800],
                marginBottom: 3,
                fontWeight: "bold",
                letterSpacing: "0.5px", // Add letter spacing for better readability
                textTransform: "uppercase", // Uppercase to make it more prominent
                borderBottom: `2px solid ${blue[700]}`, // A subtle underline effect
                paddingBottom: 1, // Space between the text and the line
              }}
            >
              Analytics Overview
            </Typography>
            <Grid container spacing={4}>
              {/* Analytics Data in One Row */}
              <Grid item xs={12} md={3}>
                <Paper
                  elevation={6}
                  sx={{ padding: 3, backgroundColor: grey[100] }}
                >
                  <Typography variant="h6" sx={{ color: blue[700] }}>
                    Total Bookings
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", color: green[700] }}
                  >
                    {analytics.totalBookings}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={3}>
                <Paper
                  elevation={6}
                  sx={{ padding: 3, backgroundColor: grey[100] }}
                >
                  <Typography variant="h6" sx={{ color: blue[700] }}>
                    Total Users
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", color: green[700] }}
                  >
                    {totalUsers}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={3}>
                <Paper
                  elevation={6}
                  sx={{ padding: 3, backgroundColor: grey[100] }}
                >
                  <Typography variant="h6" sx={{ color: blue[700] }}>
                    Total Turfs
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", color: green[700] }}
                  >
                    {totalTurfs}
                  </Typography>
                </Paper>
              </Grid>
              {/* Most Booked Turf in the same row */}
              <Grid item xs={12} md={3}>
                <Paper
                  elevation={6}
                  sx={{ padding: 3, backgroundColor: grey[100] }}
                >
                  <Typography variant="h6" sx={{ color: blue[700] }}>
                    Most Booked Turf
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", color: orange[700] }}
                  >
                    {displayMostBookedTurf}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Booking chart */}
            <Grid item xs={12}>
              <BookingsChart bookingsData={bookingsPerDay} />
            </Grid>
          </>
        )}

        {selectedTab === "turfApproval" && (
          <>
            <Typography
              variant="h4"
              sx={{
                color: blue[800],
                marginBottom: 3,
                fontWeight: "bold",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                borderBottom: `2px solid ${blue[700]}`,
                paddingBottom: 1,
              }}
            >
              Turf Registration Requests
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Paper
                  elevation={6}
                  sx={{ padding: 3, backgroundColor: grey[100] }}
                >
                  {Array.isArray(turfs) && turfs.length > 0 ? (
                    turfs.map((turf) => (
                      <Box
                        key={turf.id}
                        sx={{
                          marginBottom: 2,
                          padding: 2,
                          borderRadius: 1,
                          backgroundColor:
                            turf.status === "PENDING"
                              ? yellow[100]
                              : turf.status === "APPROVED"
                              ? green[100]
                              : red[100],
                          opacity:
                            turf.status === "APPROVED" ||
                            turf.status === "REJECTED"
                              ? 0
                              : 1,
                          transition: "opacity 3s ease-out", // Add transition for opacity change
                        }}
                        className={
                          turf.status === "APPROVED"
                            ? "animate-slide-right-fade"
                            : turf.status === "REJECTED"
                            ? "animate-slide-left-fade"
                            : ""
                        }
                      >
                        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                          {turf.turfName} - {turf.location}
                        </Typography>
                        <Typography
                          variant="body2"
                          color={
                            turf.status === "PENDING"
                              ? "orange"
                              : turf.status === "APPROVED"
                              ? "green"
                              : "red"
                          }
                        >
                          {turf.status}
                        </Typography>
                        {turf.status === "PENDING" && (
                          <Box sx={{ marginTop: 1 }}>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              sx={{ marginRight: 1 }}
                              onClick={() => handleApprove(turf.id)}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={() => handleReject(turf.id)}
                            >
                              Reject
                            </Button>
                          </Box>
                        )}
                      </Box>
                    ))
                  ) : (
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      align="center"
                    >
                      No turfs available for approval.
                    </Typography>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </>
        )}

        {selectedTab === "allTurfs" && (
          <>
            <Typography
              variant="h4"
              sx={{
                color: blue[800],
                marginBottom: 3,
                fontWeight: "bold",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                borderBottom: `2px solid ${blue[700]}`,
                paddingBottom: 1,
              }}
            >
              All Turfs
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Paper
                  elevation={6}
                  sx={{ padding: 3, backgroundColor: grey[100] }}
                >
                  {Array.isArray(turfs) && turfs.length > 0 ? (
                    turfs.map((turf, index) => (
                      <Card
                        key={index}
                        sx={{
                          marginBottom: 2,
                          borderRadius: 3,
                          boxShadow: 3,
                          transition: "transform 0.3s, box-shadow 0.3s",
                          "&:hover": {
                            transform: "translateY(-5px)",
                            boxShadow: 6,
                          },
                        }}
                      >
                        <CardActionArea>
                          <CardContent>
                            <Grid container spacing={2} alignItems="center">
                              {/* First Column - Turf Name and Location */}
                              <Grid item xs={3}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <Typography
                                    variant="h5"
                                    sx={{
                                      fontWeight: "bold",
                                      color: blue[800],
                                    }}
                                  >
                                    {turf?.name || "Unknown Turf"}
                                  </Typography>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      mt: 1,
                                    }}
                                  >
                                    <LocationOnIcon
                                      sx={{
                                        fontSize: 20,
                                        color: blue[600],
                                        mr: 1,
                                      }}
                                    />
                                    <Typography
                                      variant="body2"
                                      color="textSecondary"
                                    >
                                      {turf?.location || "Unknown Location"}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>

                              {/* Second Column - Owner Name and Registered On */}
                              <Grid item xs={3}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <Typography
                                    variant="h6"
                                    sx={{
                                      fontWeight: "bold",
                                      color: blue[700],
                                    }}
                                  >
                                    {turf?.owner || "Unknown Owner"}
                                  </Typography>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      mt: 1,
                                    }}
                                  >
                                    <PersonIcon
                                      sx={{
                                        fontSize: 20,
                                        color: blue[500],
                                        mr: 1,
                                      }}
                                    />
                                    <Typography
                                      variant="body2"
                                      color="textSecondary"
                                    >
                                      {turf?.registeredOn
                                        ? `Registered: ${turf.registeredOn}`
                                        : "Registration Date Unknown"}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>

                              {/* Third Column - Rating */}

                              <Grid item xs={3}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                  }}
                                >
                                  {turf?.rating > 0 ? (
                                    <>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          mb: 1,
                                        }}
                                      >
                                        {/* Rating Display */}
                                        <Rating
                                          name={`turf-rating-${index}`}
                                          value={turf?.rating || 0}
                                          precision={0.5}
                                          readOnly
                                          size="small"
                                          sx={{
                                            color: green[700],
                                            mr: 1,
                                          }}
                                        />

                                        {/* Rating Count */}
                                        <Typography
                                          variant="body2"
                                          color="textSecondary"
                                          sx={{ color: green[800] }}
                                        >
                                          ({turf?.ratingCount || 0})
                                        </Typography>
                                      </Box>

                                      {/* Rating Message */}
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          mt: 1,
                                          color: green[800],
                                          fontWeight: 500,
                                        }}
                                      >
                                        <StarIcon
                                          sx={{
                                            fontSize: 20,
                                            mr: 0.5,
                                            color: green[600],
                                          }}
                                        />
                                        {`${turf.rating} out of 5`}
                                      </Typography>
                                    </>
                                  ) : (
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        mt: 1,
                                        color: "textSecondary",
                                        fontStyle: "italic",
                                        textAlign: "center",
                                        width: "100%",
                                      }}
                                    >
                                      Not Rated Yet
                                    </Typography>
                                  )}
                                </Box>
                              </Grid>

                              {/* Fourth Column - List of Games */}
                              <Grid item xs={3}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <Typography
                                    variant="h6"
                                    sx={{
                                      fontWeight: "bold",
                                      color: purple[700],
                                    }}
                                  >
                                    Games Available
                                  </Typography>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      mt: 1,
                                    }}
                                  >
                                    <SportsSoccerIcon
                                      sx={{
                                        fontSize: 20,
                                        color: purple[500],
                                        mr: 1,
                                      }}
                                    />
                                    <Typography
                                      variant="body2"
                                      color="textSecondary"
                                    >
                                      {Array.isArray(turf?.availableGames)
                                        ? turf.availableGames.join(", ")
                                        : "No Games Available"}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    ))
                  ) : (
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      align="center"
                    >
                      No turfs available.
                    </Typography>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </>
        )}
        {selectedTab === "allBookings" && (
          <>
            <Typography
              variant="h4"
              sx={{
                color: blue[800],
                marginBottom: 3,
                fontWeight: "bold",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                borderBottom: `2px solid ${blue[700]}`,
                paddingBottom: 1,
              }}
            >
              All Bookings
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Paper
                  elevation={6}
                  sx={{ padding: 3, backgroundColor: grey[100] }}
                >
                  {Array.isArray(bookings) && bookings.length > 0 ? (
                    bookings.map((booking) => (
                      <Box
                        key={booking.id}
                        sx={{
                          marginBottom: 1,
                          padding: 2,
                          borderRadius: 2,
                          backgroundColor: blue[50],
                          "&:hover": {
                            backgroundColor: blue[100],
                            boxShadow: 4,
                            cursor: "pointer",
                          },
                        }}
                      >
                        <Grid container spacing={2}>
                          {/* First Column - Name and Date */}
                          <Grid item xs={4}>
                            <Box
                              sx={{ display: "flex", flexDirection: "column" }}
                            >
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: "bold", color: blue[800] }}
                              >
                                {booking.user}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {`${booking.date} - ${booking.time.substring(
                                  0,
                                  5
                                )}`}
                              </Typography>
                            </Box>
                          </Grid>

                          {/* Second Column - Turf and Game */}
                          <Grid item xs={4}>
                            <Box
                              sx={{ display: "flex", flexDirection: "column" }}
                            >
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: "bold", color: blue[700] }}
                              >
                                {booking.turf}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {booking.game}
                              </Typography>
                            </Box>
                          </Grid>

                          {/* Third Column - Price */}
                          <Grid item xs={4}>
                            <Box
                              sx={{ display: "flex", flexDirection: "column" }}
                            >
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: "bold", color: orange[700] }}
                              >
                                {booking.price}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    ))
                  ) : (
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      align="center"
                    >
                      No bookings available.
                    </Typography>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
