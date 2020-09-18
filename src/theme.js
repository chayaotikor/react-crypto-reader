import { createMuiTheme } from "@material-ui/core/styles";

//REFRESHR Colors

//Background: #0b2742
//Background Contrast Text: #FFFFFF
//Cards: #FFFFFF
//Card Contrast Text:#0b2742

//breakpoint values {xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920}

export default createMuiTheme({
  typography: {
    htmlFontSize: 10,
    useNextVariants: true,
    body1: { color: "inherit" },
    body2: { color: "inherit" },
  },
  palette: {
    primary: {
      main: "#FFFFFF",
      contrastText: "#000000",
    },
    secondary: {
      main: "#000000",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#FFFFFF",
      paper: "#FFFFFF",
    },
    tonalOffset: 0.2,
  },
});
