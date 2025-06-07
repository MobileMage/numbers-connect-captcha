# Connect the Numbers - "I'm not a robot" Widget

This is a React Native component that implements a simple "I'm not a robot" verification widget. The user is required to connect numbers in order from 1 to 8.

## How it works

The numbers 1 to 8 are randomly placed on a grid. The user must connect the numbers in the correct order (1 → 2 → 3 → … → 8) by drawing lines between them. The system waits until the user finishes connecting all numbers before validating.

- If the order is correct, a green flash effect is triggered.
- If the order is incorrect, a red flash effect is triggered.

After the flash, the board resets for another attempt.

## Visual Style

- The canvas is clean and minimal.
- There are no borders or containers around the numbers.
- The numbers are simple black digits.
- The path the user draws is a black line.
- A "Reset" button is available to clear the board and try again.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
