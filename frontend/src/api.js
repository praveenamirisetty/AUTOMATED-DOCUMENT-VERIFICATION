export async function fetchDocuments() {
  // Simulating API response with a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          name: "Alice Johnson",
          country: "USA",
          gender: "Female",
          dob: "1992-05-14",
          status: "Verified",
          riskScore: "Low",
        },
        {
          name: "Rahul Verma",
          country: "India",
          gender: "Male",
          dob: "1988-11-02",
          status: "Flagged",
          riskScore: "Medium",
        },
        {
          name: "Maria Gonzalez",
          country: "Spain",
          gender: "Female",
          dob: "1995-07-23",
          status: "Rejected",
          riskScore: "High",
        },
      ]);
    }, 1000);
  });
}