# RPMP Client

RPMP Client is a dashboard built with React, Tanstack Query + Router, Mantine, and Supabase that allows the meal service company [Real Prep Meal Prep](https://realprepmealprep.com/) to handle several internal processes. See below for the main features and links to demos and related repositories

## Features

- **Authentication** is handled with Supabase. Users sign in with an email and password and are given one of four roles: admin, owner, manager, employee. Admins and owners can create and delete profiles under the Employees page, and any user can update their profile information on the Home page (by either clicking their avatar in the navbar or the title and logo at the top of the page).

- **Order Processing** involves uploading a csv file of meal orders (a sample can be downloaded by clicking [here](./public/sample-orders.csv)). The user can then review the uploaded data and verify an initial aggregate of the needed ingredients, edit a shopping list, and finally download a finalized order report pdf generated on the [backend](https://github.com/nathancarllopez/rpmp-server). Additionally, under the Backstock tab users can view and edit the amount of frozen leftovers used during the order processing calculations.

- **Timecard Generation** can be found on the Timecards tab: forms for each employee are shown on the first screen which generate a pdf of timecards upon submission.

## Demo and Client Side Repo

A demo of the dashboard hosted on Netlify can be accessed [here](https://rpmp-client.netlify.app/). Use the following credentials to log in:

- **email**: darkside@empire.com
- **email**: ilovepadme

You can test all of the features listed above; in particular, if you'd like to try the order processing you can download a csv file of samplle orders [here](./public/sample-orders.csv)

The repository for the server side code can be found [here](https://github.com/nathancarllopez/rpmp-server).
