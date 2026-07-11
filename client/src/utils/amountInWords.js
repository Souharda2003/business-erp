export function amountInWords(amount) {
  const words = [
    "",

    "One",

    "Two",

    "Three",

    "Four",

    "Five",

    "Six",

    "Seven",

    "Eight",

    "Nine",

    "Ten",

    "Eleven",

    "Twelve",

    "Thirteen",

    "Fourteen",

    "Fifteen",

    "Sixteen",

    "Seventeen",

    "Eighteen",

    "Nineteen",
  ];

  const tens = [
    "",

    "",

    "Twenty",

    "Thirty",

    "Forty",

    "Fifty",

    "Sixty",

    "Seventy",

    "Eighty",

    "Ninety",
  ];

  function convert(num) {
    if (num < 20) {
      return words[num];
    }

    if (num < 100) {
      return tens[Math.floor(num / 10)] + " " + words[num % 10];
    }

    if (num < 1000) {
      return words[Math.floor(num / 100)] + " Hundred " + convert(num % 100);
    }

    if (num < 100000) {
      return (
        convert(Math.floor(num / 1000)) + " Thousand " + convert(num % 1000)
      );
    }

    if (num < 10000000) {
      return (
        convert(Math.floor(num / 100000)) + " Lakh " + convert(num % 100000)
      );
    }

    return (
      convert(Math.floor(num / 10000000)) + " Crore " + convert(num % 10000000)
    );
  }

  return convert(Math.floor(amount)) + " Only";
}
