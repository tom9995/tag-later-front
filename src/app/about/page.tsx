import { Container, Typography, Box } from "@mui/material";

export default function AboutPage() {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          TagLater について
        </Typography>
        <Typography variant="body1" paragraph>
          TagLaterは、ウェブページを保存・管理するためのブックマークアプリケーションです。
        </Typography>
        <Typography variant="body1" paragraph>
          お気に入りの記事やウェブサイトを保存し、タグで整理して後で読み返すことができます。
        </Typography>
      </Box>
    </Container>
  );
}
