import { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router';

import {
  BalanceRounded,
  BarChartRounded,
  FactoryRounded,
  PlayArrowRounded,
  SwapHorizRounded,
  TrendingDownRounded,
  TrendingUpRounded,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  Typography,
  type SelectChangeEvent,
} from '@mui/material';

import type { RegionCode } from '../../config/regions';
import {
  useGetCapacityForecastsQuery,
  useGetCapacityScenariosQuery,
  type CapacityForecast,
  type CapacityScenario,
} from '../../store';
import { getDataRegion } from '../../utils/regionFilters';
import OperationsHeader from '../dashboard/OperationsHeader';

const horizonOptions = [7, 14, 30] as const;

export default function Capacity() {
  const { region } = useOutletContext<{ region: RegionCode }>();
  const selectedDataRegion = getDataRegion(region);
  const { data: forecasts = [], isFetching } = useGetCapacityForecastsQuery();
  const { data: scenarios = [] } = useGetCapacityScenariosQuery();
  const [horizonDays, setHorizonDays] = useState<(typeof horizonOptions)[number]>(7);
  const [selectedScenarioIds, setSelectedScenarioIds] = useState<string[]>([]);
  const [comparisonRan, setComparisonRan] = useState(false);

  const regionForecasts = useMemo(
    () =>
      forecasts
        .filter((forecast) => forecast.region === selectedDataRegion && forecast.horizonDays <= horizonDays)
        .sort((left, right) => getVariance(left) - getVariance(right)),
    [forecasts, horizonDays, selectedDataRegion],
  );

  const regionScenarios = useMemo(
    () =>
      scenarios
        .filter((scenario) => scenario.region === selectedDataRegion && scenario.horizonDays <= horizonDays)
        .sort((left, right) => right.shortfallReduction - left.shortfallReduction),
    [horizonDays, scenarios, selectedDataRegion],
  );

  const selectedScenarios = regionScenarios.filter((scenario) => selectedScenarioIds.includes(scenario.id));
  const shortfalls = regionForecasts.filter((forecast) => forecast.capacity < forecast.demand);
  const surpluses = regionForecasts.filter((forecast) => forecast.capacity >= forecast.demand);
  const totalDemand = sum(regionForecasts.map((forecast) => forecast.demand));
  const totalCapacity = sum(regionForecasts.map((forecast) => forecast.capacity));
  const netVariance = totalCapacity - totalDemand;

  const handleScenarioToggle = (scenarioId: string) => {
    setComparisonRan(false);
    setSelectedScenarioIds((current) =>
      current.includes(scenarioId)
        ? current.filter((id) => id !== scenarioId)
        : [...current, scenarioId].slice(-3),
    );
  };

  return (
    <Stack spacing={3} sx={{ width: '100%' }}>
      <OperationsHeader
        pageName="Capacity Outlook"
        liveUpdate={false}
        title="CAPACITY FORECASTING & PLANNING"
        desc={`Forecast demand against capacity by region, lane and facility in ${selectedDataRegion}.`}
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
          gap: 1.4,
        }}
      >
        <MetricCard label="Forecast records" value={isFetching ? '...' : String(regionForecasts.length)} tone="blue" />
        <MetricCard label="Shortfalls" value={String(shortfalls.length)} tone="red" />
        <MetricCard label="Surpluses" value={String(surpluses.length)} tone="green" />
        <MetricCard label="Net variance" value={`${netVariance > 0 ? '+' : ''}${netVariance}%`} tone={netVariance < 0 ? 'red' : 'green'} />
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
          flexWrap: 'wrap',
          border: '1px solid #d9e3ed',
          borderRadius: '10px',
          backgroundColor: '#ffffff',
          p: 1.4,
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <BarChartRounded sx={{ color: '#159d95' }} />
          <Box>
            <Typography sx={{ color: '#10243a', fontSize: 15, fontWeight: 900 }}>
              Forecast horizon
            </Typography>
            <Typography sx={{ color: '#64758a', fontSize: 12 }}>
              Region is controlled from the top header.
            </Typography>
          </Box>
        </Stack>
        <Select
          value={String(horizonDays)}
          onChange={(event: SelectChangeEvent) => setHorizonDays(Number(event.target.value) as (typeof horizonOptions)[number])}
          sx={{
            height: 38,
            minWidth: 160,
            backgroundColor: '#ffffff',
            color: '#1b2b40',
            fontSize: 13,
            fontWeight: 800,
            '& fieldset': { borderColor: '#d5e0eb', borderRadius: '8px' },
          }}
        >
          {horizonOptions.map((option) => (
            <MenuItem key={option} value={String(option)}>
              Next {option} days
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 1.15fr) minmax(360px, 0.85fr)' },
          gap: 2,
          alignItems: 'start',
        }}
      >
        <ForecastPanel forecasts={regionForecasts} />
        <ScenarioPanel
          comparisonRan={comparisonRan}
          scenarios={regionScenarios}
          selectedScenarios={selectedScenarios}
          selectedScenarioIds={selectedScenarioIds}
          onRunComparison={() => setComparisonRan(true)}
          onScenarioToggle={handleScenarioToggle}
        />
      </Box>
    </Stack>
  );
}

function ForecastPanel({ forecasts }: { forecasts: CapacityForecast[] }) {
  return (
    <Box
      sx={{
        border: '1px solid #d9e3ed',
        borderRadius: '10px',
        backgroundColor: '#ffffff',
        p: 1.8,
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1.5 }}>
        <FactoryRounded sx={{ color: '#159d95' }} />
        <Box>
          <Typography sx={{ color: '#159d95', fontSize: 11, fontWeight: 900, letterSpacing: 1.4 }}>
            REGION, LANE & FACILITY
          </Typography>
          <Typography sx={{ color: '#10243a', fontSize: 21, fontWeight: 900 }}>
            Capacity Forecast
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={1.2}>
        {forecasts.length === 0 ? (
          <Box sx={{ border: '1px solid #e0e8f0', borderRadius: '8px', p: 3, textAlign: 'center' }}>
            <Typography sx={{ color: '#63758c', fontSize: 13, fontWeight: 800 }}>
              No capacity forecasts for this region and horizon.
            </Typography>
          </Box>
        ) : (
          forecasts.map((forecast) => <ForecastCard key={forecast.id} forecast={forecast} />)
        )}
      </Stack>
    </Box>
  );
}

function ForecastCard({ forecast }: { forecast: CapacityForecast }) {
  const variance = getVariance(forecast);
  const color = variance < 0 ? tonePalette.red : tonePalette.green;

  return (
    <Box
      sx={{
        border: `1px solid ${color.border}`,
        borderLeft: `5px solid ${color.main}`,
        borderRadius: '8px',
        backgroundColor: variance < 0 ? '#fff7f7' : '#f3fbf7',
        p: 1.4,
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={1}
        sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, mb: 1.2 }}
      >
        <Box>
          <Typography sx={{ color: '#10243a', fontSize: 15, fontWeight: 900 }}>
            {forecast.origin} to {forecast.destination}
          </Typography>
          <Typography sx={{ color: '#64758a', fontSize: 12, fontWeight: 700 }}>
            {forecast.facility} / {forecast.facilityCode} / {forecast.horizonDays} days
          </Typography>
        </Box>
        <Stack direction="row" spacing={0.7} sx={{ flexWrap: 'wrap', rowGap: 0.7 }}>
          <Chip
            icon={variance < 0 ? <TrendingDownRounded /> : <TrendingUpRounded />}
            label={variance < 0 ? `Shortfall ${Math.abs(variance)}%` : `Surplus ${variance}%`}
            sx={chipSx(color)}
          />
          <Chip label={`${forecast.direction === 'down' ? 'Down' : 'Up'} ${forecast.trend}%`} />
        </Stack>
      </Stack>

      <CapacityBar label="Demand" value={forecast.demand} color="#d66b29" />
      <CapacityBar label="Capacity" value={forecast.capacity} color="#159d95" />
    </Box>
  );
}

function CapacityBar({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <Box sx={{ mt: 1 }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.4 }}>
        <Typography sx={{ color: '#52677f', fontSize: 11, fontWeight: 900 }}>{label}</Typography>
        <Typography sx={{ color: '#10243a', fontSize: 11, fontWeight: 900 }}>{value}%</Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          height: 10,
          borderRadius: 999,
          backgroundColor: '#e3ebf2',
          '& .MuiLinearProgress-bar': { backgroundColor: color },
        }}
      />
    </Box>
  );
}

function ScenarioPanel({
  comparisonRan,
  onRunComparison,
  onScenarioToggle,
  scenarios,
  selectedScenarioIds,
  selectedScenarios,
}: {
  comparisonRan: boolean;
  onRunComparison: () => void;
  onScenarioToggle: (value: string) => void;
  scenarios: CapacityScenario[];
  selectedScenarioIds: string[];
  selectedScenarios: CapacityScenario[];
}) {
  return (
    <Stack spacing={2}>
      <Box
        sx={{
          border: '1px solid #d9e3ed',
          borderRadius: '10px',
          backgroundColor: '#ffffff',
          p: 1.8,
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1.4 }}>
          <SwapHorizRounded sx={{ color: '#159d95' }} />
          <Box>
            <Typography sx={{ color: '#159d95', fontSize: 11, fontWeight: 900, letterSpacing: 1.4 }}>
              SERVICE RETURNED WHAT-IF OPTIONS
            </Typography>
            <Typography sx={{ color: '#10243a', fontSize: 21, fontWeight: 900 }}>
              Scenario Selection
            </Typography>
          </Box>
        </Stack>

        <Stack spacing={1}>
          {scenarios.map((scenario) => (
            <Box
              key={scenario.id}
              component="button"
              onClick={() => onScenarioToggle(scenario.id)}
              sx={{
                width: '100%',
                textAlign: 'left',
                border: `1px solid ${selectedScenarioIds.includes(scenario.id) ? '#159d95' : '#d9e3ed'}`,
                borderRadius: '8px',
                backgroundColor: selectedScenarioIds.includes(scenario.id) ? '#eefbf9' : '#ffffff',
                p: 1.2,
                cursor: 'pointer',
              }}
            >
              <Typography sx={{ color: '#10243a', fontSize: 14, fontWeight: 900 }}>
                {scenario.name}
              </Typography>
              <Typography sx={{ color: '#64758a', fontSize: 12, mt: 0.5 }}>
                {scenario.description}
              </Typography>
              <Stack direction="row" spacing={0.7} sx={{ mt: 1, flexWrap: 'wrap', rowGap: 0.7 }}>
                <Chip size="small" label={`${scenario.horizonDays} days`} />
                <Chip size="small" label={`+${scenario.addedCapacity}% capacity`} />
                <Chip size="small" label={`Cost ${formatCurrency(scenario.costImpactUsd)}`} />
              </Stack>
            </Box>
          ))}
        </Stack>

        <Button
          fullWidth
          variant="contained"
          startIcon={<PlayArrowRounded />}
          disabled={selectedScenarios.length === 0}
          onClick={onRunComparison}
          sx={{ mt: 1.5, py: 1.2, fontWeight: 900, borderRadius: '8px', backgroundColor: '#159d95' }}
        >
          Run comparison
        </Button>
      </Box>

      <ComparisonPanel comparisonRan={comparisonRan} scenarios={selectedScenarios} />
    </Stack>
  );
}

function ComparisonPanel({
  comparisonRan,
  scenarios,
}: {
  comparisonRan: boolean;
  scenarios: CapacityScenario[];
}) {
  return (
    <Box
      sx={{
        border: '1px solid #d9e3ed',
        borderRadius: '10px',
        backgroundColor: '#ffffff',
        p: 1.8,
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1.2 }}>
        <BalanceRounded sx={{ color: '#159d95' }} />
        <Typography sx={{ color: '#10243a', fontSize: 18, fontWeight: 900 }}>
          Scenario Comparison
        </Typography>
      </Stack>

      {!comparisonRan ? (
        <Typography sx={{ color: '#63758c', fontSize: 13 }}>
          Select one or more scenarios and run comparison.
        </Typography>
      ) : (
        <Stack spacing={1}>
          {scenarios.map((scenario) => (
            <Box key={scenario.id} sx={{ border: '1px solid #e0e8f0', borderRadius: '8px', p: 1.2 }}>
              <Typography sx={{ color: '#10243a', fontSize: 14, fontWeight: 900 }}>
                {scenario.name}
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0.8, mt: 1 }}>
                <MiniMetric label="Projected OTD" value={`${scenario.projectedOtd}%`} />
                <MiniMetric label="Cost impact" value={formatCurrency(scenario.costImpactUsd)} />
                <MiniMetric label="At-risk reduced" value={String(scenario.atRiskReduction)} />
                <MiniMetric label="Shortfall reduced" value={`${scenario.shortfallReduction}%`} />
              </Box>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ border: '1px solid #e1eaf2', borderRadius: '8px', p: 0.9 }}>
      <Typography sx={{ color: '#64758a', fontSize: 10, fontWeight: 900 }}>{label}</Typography>
      <Typography sx={{ color: '#10243a', fontSize: 13, fontWeight: 900, mt: 0.3 }}>{value}</Typography>
    </Box>
  );
}

function MetricCard({
  label,
  tone,
  value,
}: {
  label: string;
  tone: 'blue' | 'green' | 'red';
  value: string;
}) {
  const color = tonePalette[tone];

  return (
    <Box
      sx={{
        border: `1px solid ${color.border}`,
        borderLeft: `4px solid ${color.main}`,
        borderRadius: '8px',
        backgroundColor: color.bg,
        p: 1.5,
      }}
    >
      <Typography sx={{ color: '#5d7088', fontSize: 12, fontWeight: 900 }}>{label}</Typography>
      <Typography sx={{ color: color.text, fontSize: 26, fontWeight: 900 }}>{value}</Typography>
    </Box>
  );
}

function getVariance(forecast: CapacityForecast) {
  return forecast.capacity - forecast.demand;
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function chipSx(color: { bg: string; border: string; text: string }) {
  return {
    backgroundColor: color.bg,
    border: `1px solid ${color.border}`,
    color: color.text,
    fontSize: 11,
    fontWeight: 900,
    height: 24,
  };
}

const tonePalette = {
  blue: { bg: '#f2f7ff', border: '#c9daf5', main: '#4b68cf', text: '#263f98' },
  green: { bg: '#effaf5', border: '#bce6cf', main: '#2f8f6b', text: '#237155' },
  red: { bg: '#fff0f0', border: '#ffc4c4', main: '#d74d4d', text: '#a22727' },
};
