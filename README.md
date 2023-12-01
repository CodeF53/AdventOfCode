# Advent Of Code Typescript
My solutions for [Advent of Code](https://adventofcode.com).

## Usage
Ensure you have `npm`, have ran `npm i`, and [have set up your AOC token](#advent-of-code-token)

```
npm start
```

## Advent Of Code Token
1. go to any AOC input in your browser, such as [2022/day/1/input](https://adventofcode.com/2022/day/1/input)
2. <key>ctrl</key>+<key>shift</key>+<key>i</key> to open devtools
3. go to the "Network" tab of the devtools and refresh the page
4. click the request that looks like "200 GET INPUT"
5. click the "Cookies" tab of the request view, and copy the value of session
![an example of where you should be looking](./misc/advent_cookie_guide.webp)

Once you have your token, create `.env` with your token, using `.env.example` for help with formatting.
