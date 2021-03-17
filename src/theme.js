import { createMuiTheme } from "@material-ui/core/styles"
import { red } from "@material-ui/core/colors"

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#F19721",
      contrastText: "#fff"
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#fff",
    },
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: 'none',

      },
    },
  },
})

export default theme
