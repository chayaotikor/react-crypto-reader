import { createMuiTheme } from "@material-ui/core/styles";

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
      default: "#52154e",
      paper: "#52154e",
    },
    tonalOffset: 0.2,
  },
});
