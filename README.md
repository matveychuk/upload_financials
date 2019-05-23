The task description is:

We need a component for users to upload custom tabular data in CSV or XLSX format to load into a database in the backend.
User selects CSV/XLSX file by dragging into browser tab or using the browser’s dialog.
App returns HTML table view of their uploaded data. (You can assume for now that it will be small enough table that you should return all rows, but later on that might cause performance issues.)
If user is importing to a table with standardized columns such as billings, allow user to select one of these preset column sets.
User matches column names to load into database to columns of the uploaded file. For free-form tables, user can select the column name from a header or manually edit. The user should be able to select a column name, then click a cell in the HTML table to select its column.
When user has selected all the wanted columns, they click submit. The server will return with success or error messages for missing data cells. (You can assume for now that you do not need to provide an interface for editing the data in the browser to resolve errors, but you should give the user enough information for them to fix the issue outside the app, e.g. in excel.)
We will probably be using React for many parts of the frontend because we will be using many JS libraries from Plotly, so it might be best to use React for this.
