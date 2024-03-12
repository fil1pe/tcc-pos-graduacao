import { ThemeOptions, createTheme } from '@mui/material/styles'

let theme = createTheme({})

theme = createTheme(theme, {} as ThemeOptions)

export { theme }
