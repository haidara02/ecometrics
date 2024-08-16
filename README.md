# Ecometrics

You can access the deployed Ecometrics webpage at (unavailable at the moment due to expired Firebase license) , or you can run the application locally by:

## Installing WSL2 & npm

Before running the Ecometrics React app, you'll need to ensure you have WSL2 (Windows Subsystem for Linux 2) and npm (Node Package Manager) installed on your system. Here's how to do it:

### WSL2 Installation:

- If you're using Windows 10, follow Microsoft's official guide to install WSL2: [Windows Subsystem for Linux Installation Guide](https://docs.microsoft.com/en-us/windows/wsl/install)
- Ensure that you have WSL2 enabled and configured correctly on your system.

### npm Installation:

- npm usually comes with Node.js, so to install npm, you'll need to install Node.js. Download and install Node.js from [Node.js official website](https://nodejs.org/). The latest LTS version will work.
- Follow the installation instructions provided on the website for your operating system.

## Running Ecometrics Locally

Once you have WSL2 and npm installed, you can proceed to run the Ecometrics React app:

### Clone the Repository:

1.  Open your terminal (WSL2 terminal if you're using Windows) and navigate to the directory where you want to clone the Ecometrics repository.
2.  Run the following command to clone the repository:

        git clone https://github.com/unsw-cse-comp99-3900-24t1/capstone-project-3900h11amaple

### Install Dependencies:

1.  Navigate into the cloned repository directory:

        cd capstone-project-3900h11amaple

2.  Run npm install to install all dependencies required for the app:

        npm install

### Start the Development Server:

1.  After installing dependencies, start the development server by running:

        npm start

2.  This will compile the React app and start a development server. Once the compilation is complete, the app will automatically open in your default web browser.
