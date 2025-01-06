$(document).ready(function () {
  $("#submitForm").on("click", function () {
    resetBorders();

    const jsFormData = $("#form").serialize();
    const validationResult = validateForm(jsFormData);

    if (!validationResult.isValid) {
      highlightInvalidField(validationResult.missingField);
      scrollToInvalidField(validationResult.missingField);
      return;
    }

    const formData = parseFormData(jsFormData);

    if (!isValidStudyYear(formData["entry.1449668431"])) {
      highlightInvalidField("entry.1449668431");
      scrollToInvalidField("entry.1449668431");
      return;
    }

    if (!isValidNationality(formData["entry.929593178"])) {
      highlightInvalidField("entry.929593178");
      scrollToInvalidField("entry.929593178");
      return;
    }

    submitForm(jsFormData);
  });

  function resetBorders() {
    $(".form-group").each(function () {
      $(this).css("border", "none");
    });
  }

  function validateForm(data) {
    const requiredFields = [
      "entry.561782875", // Name
      "entry.1069561156", // Address
      "entry.300054914", // Phone
      "entry.141555134", // Faculty
      "entry.298073183", // University
      "entry.1449668431", // Study Year
      "entry.929593178", // Nationality
    ];

    const formData = parseFormData(data);

    for (let field of requiredFields) {
      if (!formData[field] || formData[field].trim() === "") {
        return { isValid: false, missingField: field };
      }
    }

    return { isValid: true };
  }

  function parseFormData(data) {
    const formData = {};
    data.split("&").forEach((pair) => {
      const [key, value] = pair.split("=");
      formData[key] = decodeURIComponent(value.replace(/\+/g, " "));
    });
    return formData;
  }

  function highlightInvalidField(fieldName) {
    $(`[name='${fieldName}']`)
      .closest(".form-group")
      .css("border", "1px solid red");
  }

  function scrollToInvalidField(fieldName) {
    const firstInvalidParent = $(`[name='${fieldName}']`).closest(
      ".form-group"
    );
    $("html, body").animate(
      {
        scrollTop: firstInvalidParent.offset().top,
      },
      500
    );
  }

  function isValidStudyYear(studyYear) {
    const validStudyYears = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "Fresh Graduated",
      "Graduated",
    ];
    return validStudyYears.includes(studyYear);
  }

  function isValidNationality(nationality) {
    const validNationalities = ["مصري", "غير مصري"];
    return validNationalities.includes(nationality);
  }

  function submitForm(jsFormData) {
    $.ajax({
      type: "POST",
      url: "https://docs.google.com/forms/d/1ZnvUHVyZYAnHDaiXx6H-RPWn02c8TBmwNhlPc6qRXkY/formResponse",
      data: jsFormData,
      async: false,
      dataType: "xml",
      crossDomain: true,
      error: function () {
        console.log("Error!");
      },
    });
  }
});
