import * as monaco from 'monaco-editor';
import draculaTheme from 'monaco-themes/themes/Dracula.json';
import active4DTheme from 'monaco-themes/themes/Active4D.json';
import monokaiTheme from 'monaco-themes/themes/Monokai.json';
import githubTheme from 'monaco-themes/themes/GitHub.json';
import nightOwlTheme from 'monaco-themes/themes/Night Owl.json';
import twilightTheme from 'monaco-themes/themes/Twilight.json';
import solarizedDarkTheme from 'monaco-themes/themes/Solarized-dark.json';
import tomorrowNightTheme from 'monaco-themes/themes/Tomorrow-Night.json';
import tomorrowTheme from 'monaco-themes/themes/Twilight.json';
import cobaltTheme from 'monaco-themes/themes/Cobalt.json';

export interface ThemeItem {
  name: string;
  data: monaco.editor.IStandaloneThemeData;
}

export interface ThemeInfo {
  name: string;
  backgroundColor: string;
}

const vsDarkTheme: monaco.editor.IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: true,
  rules: [],
  colors: {
    "editor.foreground": "#D4D4D4",
    "editor.background": "#1E1E1E",
    "editor.selectionBackground": "#264F78",
    "editor.lineHighlightBackground": "#00000020",
    "editorCursor.foreground": "#AEAFAD",
    "editorWhitespace.foreground": "#FFFFFF40"
  }
};


export const themes: ThemeItem[] = [

  { name: "vs-dark", data: vsDarkTheme as monaco.editor.IStandaloneThemeData },
  { name: 'dracula', data: draculaTheme as monaco.editor.IStandaloneThemeData },
  { name: 'active4d', data: active4DTheme as monaco.editor.IStandaloneThemeData },
  { name: 'monokai', data: monokaiTheme as monaco.editor.IStandaloneThemeData },
  { name: 'github', data: githubTheme as monaco.editor.IStandaloneThemeData },
  { name: 'nightowl', data: nightOwlTheme as monaco.editor.IStandaloneThemeData },
  { name: 'twilight', data: twilightTheme as monaco.editor.IStandaloneThemeData },
  { name: 'solarizeddark', data: solarizedDarkTheme as monaco.editor.IStandaloneThemeData },
  { name: 'tomorrowNight', data: tomorrowNightTheme as monaco.editor.IStandaloneThemeData },
  { name: 'tomorrow', data: tomorrowTheme as monaco.editor.IStandaloneThemeData },
  { name: 'cobalt', data: cobaltTheme as monaco.editor.IStandaloneThemeData },
];

export const defineAllThemes = async (monacoInstance: typeof monaco) => {
  themes.forEach(theme => {
    if (theme.name !== 'vs-dark') { //keep built-in vs-dark intact
      monacoInstance.editor.defineTheme(theme.name, theme.data);
    }
  });
};
