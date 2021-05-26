export default {
  methods: {
    sortSources(arr) {
      const sortedSources = Object.entries(
        arr.reduce((acc, reference) => {
          // Map the attributes into a hieararchy.
          ((acc[reference.medium] ||= {})[reference.day || ""] ||= []).push(
            reference.pageNumber
          );
          return acc;
        }, {})
      )
        .map(([medium, references]) => {
          // Handle each medium separately.
          const details = Object.entries(references)
            .map(([day, pageNumbers]) => {
              // Sort the page numbers ignoring nulls.
              pageNumbers = pageNumbers.filter((v) => v).sort((a, b) => a - b);
              return (
                day +
                (pageNumbers.length
                  ? (day ? ", " : "") + "s. " + pageNumbers.join(", ")
                  : "")
              );
            })
            .join(", ");
          return medium + (details ? ", " + details : "");
        })
        .join("; ");

      return sortedSources;
    }
  }
};
