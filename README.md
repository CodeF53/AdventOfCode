# Advent Of Code Typescript
My solutions for [Advent of Code](https://adventofcode.com).

Repo designed to minimize time fucking around and get straight to code. See it in action:

https://github.com/CodeF53/AdventOfCode/assets/37855219/a6a489bc-f61d-4ba8-9654-09005f2084d3

## Usage
Ensure you have [node and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm), have ran `npm i`, and [have set up your AOC token](#advent-of-code-token)

You can specify various start modes
```bash
# asks user what day they want to launch
npm start # equivalent to npm start ask

# instantly opens today's AOC
npm start today

# waits up to 15 minutes for tomorrow's AOC to release, starting the instant it's available
# behaves like npm start today if tomorrow's AOC won't come out within 15 minutes
npm start race
```

If you aren't using VSCode or WSL, change the code in `src/start.ts` to fit how you launch your browser/editor

## Advent Of Code Token
1. go to any AOC input in your browser, such as [2022/day/1/input](https://adventofcode.com/2022/day/1/input)
2. <key>ctrl</key>+<key>shift</key>+<key>i</key> to open devtools
3. go to the "Network" tab of the devtools and refresh the page
4. click the request that looks like "200 GET INPUT"
5. click the "Cookies" tab of the request view, and copy the value of session

![an example of where you should be looking](./misc/advent_cookie_guide.webp)

Once you have your token, create `.env` with your token, using `.env.example` for help with formatting.
