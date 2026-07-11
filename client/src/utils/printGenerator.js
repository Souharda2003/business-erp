export const printStatement = (id) => {
  const content = document.getElementById(id);

  const win = window.open(
    "",

    "_blank",
  );

  win.document.write(content.innerHTML);

  win.print();

  win.close();
};
