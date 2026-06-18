import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Paper, Box, Button } from "@mui/material";
import AnimatedPage from "../../components/animations/AnimatedPage";
import { useLiveSession } from "../../contexts/liveSession/LiveSessionContextProvider";

function ResultsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getResults, getSession, getLeaderboard } = useLiveSession();
  const [results, setResults] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await getResults(id);
      if (res && res.success) {
        const data = res.data?.data || res.data;
        setResults(data || res);
      }
      // ensure session meta is loaded
      getSession(id).catch(() => {});
      getLeaderboard(id).catch(() => {});
    };

    load();
  }, [id]);

  return (
    <AnimatedPage>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h5">Session Results</Typography>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Back
            </Button>
          </Box>

          {!results && <Typography>Loading results…</Typography>}

          {results && (
            <Box>
              <Typography variant="h6">Final Leaderboard</Typography>
              {(results.final_leaderboard || results.leaderboard || []).map((row, idx) => (
                <Box
                  key={row.user_id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    py: 0.5,
                  }}
                >
                  <Typography>
                    {idx + 1}. {row.user_name}
                  </Typography>
                  <Typography>{row.current_score ?? row.points ?? 0}</Typography>
                </Box>
              ))}

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6">Question Breakdown</Typography>
                {(results.question_stats || results.questions || []).map((q, i) => (
                  <Paper key={q.question_id || q.id} sx={{ p: 1, my: 1 }}>
                    <Typography variant="body2">
                      {i + 1}. {q.question_text || q.text}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Correct: {q.correct_answers ?? q.correct_option_label ?? 0}
                      {q.total_answers !== undefined && ` / ${q.total_answers}`}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
    </AnimatedPage>
  );
}

export default ResultsPage;
