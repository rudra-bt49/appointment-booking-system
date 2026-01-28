import "./globals.css";

export const metadata = {
  title: "Appointment Booking System",
  description: "Book appointments with doctors easily",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
