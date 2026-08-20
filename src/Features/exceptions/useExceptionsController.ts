import { useEffect, useMemo, useState } from 'react';

import {
  useGetExceptionsQuery,
  useUpdateExceptionMutation,
  type ExceptionItem,
  type ExceptionStatus,
} from '../../store';
import {
  defaultAlertThresholds,
  livePreviewException,
  type ExceptionStatusFilter,
} from './exceptions.constants';
import {
  getCriticalNewExceptions,
  getExceptionQueue,
  isPreviewException,
} from './exceptions.utils';

export function useExceptionsController() {
  const {
    data: exceptions = [],
    isFetching,
    refetch,
  } = useGetExceptionsQuery(undefined, { pollingInterval: 15000 });
  const [updateException, { isLoading: isUpdating }] = useUpdateExceptionMutation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ExceptionStatusFilter>('Active');
  const [livePreviewVisible, setLivePreviewVisible] = useState(false);
  const [toastException, setToastException] = useState<ExceptionItem | null>(null);
  const [thresholds, setThresholds] = useState(defaultAlertThresholds);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLivePreviewVisible(true);
      setToastException(livePreviewException);
    }, 2500);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!toastException || toastException.severity === 'Critical') {
      return;
    }

    const timer = window.setTimeout(() => setToastException(null), 5000);

    return () => window.clearTimeout(timer);
  }, [toastException]);

  const queue = useMemo(
    () =>
      getExceptionQueue({
        exceptions,
        livePreviewVisible,
        previewException: livePreviewException,
        searchTerm,
        statusFilter,
      }),
    [exceptions, livePreviewVisible, searchTerm, statusFilter],
  );

  const criticalNew = useMemo(() => getCriticalNewExceptions(queue), [queue]);

  const handleStatusChange = async (exception: ExceptionItem, status: ExceptionStatus) => {
    if (isPreviewException(exception)) {
      setLivePreviewVisible(false);
      setToastException(null);
      return;
    }

    await updateException({ id: exception.id, status }).unwrap();
    await refetch();
  };

  const handleAssigneeChange = async (exception: ExceptionItem, assignee: string) => {
    if (isPreviewException(exception)) {
      return;
    }

    await updateException({ id: exception.id, assignee }).unwrap();
    await refetch();
  };

  return {
    criticalNew,
    handleAssigneeChange,
    handleStatusChange,
    isFetching,
    isUpdating,
    queue,
    searchTerm,
    setSearchTerm,
    setStatusFilter,
    setThresholds,
    setToastException,
    statusFilter,
    thresholds,
    toastException,
  };
}
