$(document).ready(function() {
  const fs = require("fs");
  const homeDir = require("os").homedir();
  const appDir = homeDir + "/Documents/ImageSelect/";
  const createHTML = require("create-html");
  const { shell } = require("electron");
  fs.readdir(appDir, (err, folders) => {
    folders = folders.filter(folder => {
      if (folder !== ".DS_Store") {
        return folder;
      }
    });
    $("#projectChoose").append(
      $("<option></option>")
        .val("Select Project")
        .html("Select Project")
    );
    $.each(folders, function(i, p) {
      $("#projectChoose").append(
        $("<option></option>")
          .val(p)
          .html(p)
      );
    });

    $("#projectChoose").append(
      $("<option></option>")
        .val("Add New")
        .html("Add New")
    );

    $("#projectChoose").change(function() {
      var value = $(this).val();

      if (value === "Select Project") {
        alert("Please choose or add a new project");
      } else if (value === "Add New") {
        $(".name-container").removeClass("hide");
        $(".width-container").addClass("hide");
        $("#addBut").click(function() {
          let projectName = $("input[name=projectname]").val();
          if (!fs.existsSync(`${appDir}${projectName}`)) {
            fs.mkdirSync(`${appDir}${projectName}`);
          } else {
            let increment = 1;
            while (fs.existsSync(`${appDir}${projectName}${increment}`)) {
              increment++;
            }
            fs.mkdirSync(`${appDir}${projectName}${increment}`);
          }

          location.reload();
        });
      } else {
        $("#setBut").removeClass("hide");
        $(".name-container").addClass("hide");
        $(".width-container").addClass("hide");

        $("#setBut").click(function() {
          $("#title").text(value);
          $("#setBut").addClass("hide");
          $(".name-container").addClass("hide");
          $("#projectChoose").addClass("hide");
          $(".width-container").removeClass("hide");
          $(".alert-text").removeClass("hide");
          $(".folder-link").attr("href");
        });

        $("#runBut").click(function() {
          let width = $("input[name=imagewidth").val();
          console.log(width);
          fs.readdir(`${appDir}${value}`, (err, files) => {
            let images = files
              .filter(file => {
                if (file !== ".DS_Store" && file.indexOf(".html") === -1) {
                  return file;
                }
              })
              .map(file => {
                return `${appDir}${value}/${file}`;
              });
            if (images.length === 0) {
              alert(
                "Please make sure to add at least one image in your project folder!"
              );
            } else {
              shell.openPath(`${appDir}${value}`);
              $("#allSet").removeClass("hide");
              let imagesDiv = `<div style="width:65%;margin:0 auto;font-family: "Anton", sans-serif;">`;
              images.forEach((image, imageIdx) => {
                let imageDiv = "";
                imageDiv += `<div style="margin-right:10px;float:left"><img src="${image}" alt="${imageIdx +
                  1}" width="${width}"><p style="text-align:center">${imageIdx +
                  1}</p></div>`;
                imagesDiv += imageDiv;
              });
              imagesDiv += `</div>`;
              $(".images-div").html(imagesDiv);
              imagesDiv = `<h1 style="text-align:center;">${value}</h1><br/><br/>${imagesDiv}`;
              console.log(imagesDiv);
              $("#allSet").click(function() {
                var html = createHTML({
                  title: `${value}`,
                  head: `<meta name="viewport" content="width=device-width, initial-scale=1" />`,
                  body: imagesDiv
                });
                fs.writeFileSync(`${appDir}${value}/${value}.html`, html);

                shell.openPath(`${appDir}${value}/${value}.html`);
                location.reload();
              });
            }
          });
        });
      }
    });
  });
});
