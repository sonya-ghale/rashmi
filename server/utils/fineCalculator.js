export const calculateFine = (dueDate) => {
  const finePerDay = 10; 
  const today = new Date();

  if (today > dueDate) {
    const lateDays = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24)); 
    const fine = lateDays * finePerDay;
    return fine;
  }

  return 0;
};

