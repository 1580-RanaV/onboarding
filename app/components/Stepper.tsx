'use client';

import React, { useState, Children, useRef, useLayoutEffect, HTMLAttributes, ReactNode } from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';

interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onFinalStepCompleted?: () => void;
  stepCircleContainerClassName?: string;
  stepContainerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  backButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  nextButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  backButtonText?: string;
  nextButtonText?: string;
  disableStepIndicators?: boolean;
  stepValidations?: boolean[];
  renderStepIndicator?: (props: {
    step: number;
    currentStep: number;
    onStepClick: (clicked: number) => void;
  }) => ReactNode;
  onStepContinue?: (step: number) => Promise<boolean> | boolean;
  onStepBack?: (step: number) => Promise<boolean> | boolean;
  canNavigateToStep?: (step: number) => boolean;
  isLoading?: boolean;
}

export default function Stepper({
  children,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  stepCircleContainerClassName = '',
  stepContainerClassName = '',
  contentClassName = '',
  footerClassName = '',
  backButtonProps = {},
  nextButtonProps = {},
  backButtonText = 'Back',
  nextButtonText = 'Continue',
  disableStepIndicators = false,
  stepValidations = [],
  renderStepIndicator,
  onStepContinue,
  onStepBack,
  canNavigateToStep,
  isLoading = false,
  ...rest
}: StepperProps) {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [direction, setDirection] = useState<number>(0);
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;
  const isCompleted = currentStep > totalSteps;
  const isLastStep = currentStep === totalSteps;

  // Sync internal step with external initialStep prop
  React.useEffect(() => {
    setCurrentStep(initialStep);
  }, [initialStep]);

  const updateStep = (newStep: number) => {
    setCurrentStep(newStep);
    if (newStep > totalSteps) {
      onFinalStepCompleted();
    } else {
      onStepChange(newStep);
    }
  };

  const handleBack = async () => {
    if (currentStep > 1 && !isLoading) {
      // Call onStepBack if provided
      if (onStepBack) {
        const canGoBack = await onStepBack(currentStep);
        if (!canGoBack) {
          return; // Don't proceed if callback returns false
        }
      }
      setDirection(-1);
      updateStep(currentStep - 1);
    }
  };

  const handleNext = async () => {
    if (!isLastStep && !isLoading) {
      // Call onStepContinue if provided
      if (onStepContinue) {
        const canContinue = await onStepContinue(currentStep);
        if (!canContinue) {
          return; // Don't proceed if validation fails
        }
        // onStepContinue handles navigation internally, so we don't update step here
      } else {
        setDirection(1);
        updateStep(currentStep + 1);
      }
    }
  };

  const handleComplete = async () => {
    if (onStepContinue) {
      const canContinue = await onStepContinue(currentStep);
      if (!canContinue) {
        return;
      }
    }
    setDirection(1);
    updateStep(totalSteps + 1);
  };

  return (
    <>
      <div
        className="flex w-full h-full flex-col items-center bg-white overflow-hidden"
        {...rest}
      >
        <div className="mx-auto flex h-full w-full max-w-3xl flex-col overflow-hidden">
          <div
            className={`sticky top-0 z-20 w-full bg-white/95 backdrop-blur-sm ${stepCircleContainerClassName}`}
          >
            <div className={`${stepContainerClassName} flex w-full items-center px-4 py-4 sm:px-8 sm:py-6`}>
              {stepsArray.map((_, index) => {
                const stepNumber = index + 1;
                const isNotLastStep = index < totalSteps - 1;
                return (
                  <React.Fragment key={stepNumber}>
                    {renderStepIndicator ? (
                      renderStepIndicator({
                        step: stepNumber,
                        currentStep,
                        onStepClick: clicked => {
                          // Check if navigation to this step is allowed
                          if (canNavigateToStep && !canNavigateToStep(clicked)) {
                            return; // Prevent navigation
                          }
                          setDirection(clicked > currentStep ? 1 : -1);
                          updateStep(clicked);
                        }
                      })
                    ) : (
                      <StepIndicator
                        step={stepNumber}
                        disableStepIndicators={disableStepIndicators}
                        currentStep={currentStep}
                        onClickStep={clicked => {
                          // Check if navigation to this step is allowed
                          if (canNavigateToStep && !canNavigateToStep(clicked)) {
                            return; // Prevent navigation
                          }
                          setDirection(clicked > currentStep ? 1 : -1);
                          updateStep(clicked);
                        }}
                      />
                    )}
                    {isNotLastStep && <StepConnector isComplete={currentStep > stepNumber} />}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <div className="stepper-scroll flex-1 overflow-y-auto px-2 flex">
            <div className={`w-full min-h-full py-8 ${(currentStep === 2 || currentStep === 5) ? '' : 'flex items-center justify-center'}`}>
              <StepContentWrapper
                isCompleted={isCompleted}
                currentStep={currentStep}
                direction={direction}
                className={`space-y-2 px-4 sm:px-8 w-full max-w-3xl mx-auto ${contentClassName}`}
              >
                <div className="w-full">
                  {stepsArray[currentStep - 1]}
                </div>
              </StepContentWrapper>
            </div>
          </div>

          {!isCompleted && (
            <div
              className={`sticky bottom-0 w-full bg-white/95 px-4 sm:px-8 pb-6 sm:pb-8 pt-4 backdrop-blur-sm ${footerClassName}`}
            >
              <div className={`mt-6 flex ${currentStep !== 1 ? 'justify-between' : 'justify-end'}`}>
                {currentStep !== 1 && (
                  <button
                    onClick={handleBack}
                    className={`duration-350 rounded px-2 py-1 transition ${
                      currentStep === 1
                        ? 'pointer-events-none opacity-50 text-neutral-400'
                        : 'text-neutral-400 hover:text-neutral-700'
                    }`}
                    {...backButtonProps}
                  >
                    {backButtonText}
                  </button>
                )}
                <button
                  onClick={isLastStep ? handleComplete : handleNext}
                  disabled={(stepValidations.length > 0 && !stepValidations[currentStep - 1]) || isLoading}
                  className="duration-350 flex items-center justify-center rounded-sm py-2 px-4 font-medium tracking-tight transition"
                  style={{ 
                    backgroundColor: (stepValidations.length > 0 && !stepValidations[currentStep - 1]) || isLoading ? '#E5E5E5' : '#0080FF',
                    color: (stepValidations.length > 0 && !stepValidations[currentStep - 1]) || isLoading ? '#999999' : '#FFFFFF',
                    cursor: (stepValidations.length > 0 && !stepValidations[currentStep - 1]) || isLoading ? 'not-allowed' : 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    if ((stepValidations.length === 0 || stepValidations[currentStep - 1]) && !isLoading) {
                      e.currentTarget.style.backgroundColor = '#0066CC';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if ((stepValidations.length === 0 || stepValidations[currentStep - 1]) && !isLoading) {
                      e.currentTarget.style.backgroundColor = '#0080FF';
                    }
                  }}
                  {...nextButtonProps}
                >
                  {isLoading ? 'Loading...' : (isLastStep ? 'Complete' : nextButtonText)}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        html, body {
          overflow: hidden;
        }
        .stepper-scroll {
          scrollbar-width: thin;
          scrollbar-color: #d1d5db transparent;
        }
        .stepper-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .stepper-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .stepper-scroll::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 9999px;
          border: 2px solid transparent;
        }
      `}</style>
    </>
  );
}

interface StepContentWrapperProps {
  isCompleted: boolean;
  currentStep: number;
  direction: number;
  children: ReactNode;
  className?: string;
}

function StepContentWrapper({
  isCompleted,
  currentStep,
  direction,
  children,
  className = ''
}: StepContentWrapperProps) {
  const [parentHeight, setParentHeight] = useState<number>(0);

  return (
    <motion.div
      style={{ position: 'relative', overflow: 'hidden' }}
      animate={{ height: isCompleted ? 0 : parentHeight }}
      transition={{ type: 'spring', duration: 0.4 }}
      className={className}
    >
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        {!isCompleted && (
          <SlideTransition key={currentStep} direction={direction} onHeightReady={h => setParentHeight(h)}>
            {children}
          </SlideTransition>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface SlideTransitionProps {
  children: ReactNode;
  direction: number;
  onHeightReady: (height: number) => void;
}

function SlideTransition({ children, direction, onHeightReady }: SlideTransitionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      onHeightReady(containerRef.current.offsetHeight);
    }
  }, [children, onHeightReady]);

  return (
    <motion.div
      ref={containerRef}
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4 }}
      style={{ position: 'absolute', left: 0, right: 0, top: 0 }}
    >
      {children}
    </motion.div>
  );
}

const stepVariants: Variants = {
  enter: (dir: number) => ({
    x: dir >= 0 ? '-100%' : '100%',
    opacity: 0
  }),
  center: {
    x: '0%',
    opacity: 1
  },
  exit: (dir: number) => ({
    x: dir >= 0 ? '50%' : '-50%',
    opacity: 0
  })
};

interface StepProps {
  children: ReactNode;
}

export function Step({ children }: StepProps) {
  return <div className="px-8">{children}</div>;
}

interface StepIndicatorProps {
  step: number;
  currentStep: number;
  onClickStep: (clicked: number) => void;
  disableStepIndicators?: boolean;
}

function StepIndicator({ step, currentStep, onClickStep, disableStepIndicators = false }: StepIndicatorProps) {
  const status = currentStep === step ? 'active' : currentStep < step ? 'inactive' : 'complete';

  const handleClick = () => {
    if (step !== currentStep && !disableStepIndicators) {
      onClickStep(step);
    }
  };

  return (
    <motion.div
      onClick={handleClick}
      className="relative cursor-pointer outline-none focus:outline-none"
      animate={status}
      initial={false}
    >
      <motion.div
        variants={{
          inactive: { scale: 1, backgroundColor: '#E5E5E5', color: '#999999' },
          active: { scale: 1, backgroundColor: '#0080FF', color: '#0080FF' },
          complete: { scale: 1, backgroundColor: '#0080FF', color: '#0080FF' }
        }}
        transition={{ duration: 0.3 }}
        className="flex h-8 w-8 items-center justify-center rounded-full font-semibold"
      >
        {status === 'complete' ? (
          <CheckIcon className="h-4 w-4 text-white" />
        ) : status === 'active' ? (
          <div className="h-3 w-3 rounded-full bg-white" />
        ) : (
          <span className="text-sm">{step}</span>
        )}
      </motion.div>
    </motion.div>
  );
}

interface StepConnectorProps {
  isComplete: boolean;
}

function StepConnector({ isComplete }: StepConnectorProps) {
  const lineVariants: Variants = {
    incomplete: { width: 0, backgroundColor: 'transparent' },
    complete: { width: '100%', backgroundColor: '#0080FF' }
  };

  return (
    <div className="relative mx-2 h-0.5 flex-1 overflow-hidden rounded bg-gray-300">
      <motion.div
        className="absolute left-0 top-0 h-full"
        variants={lineVariants}
        initial={false}
        animate={isComplete ? 'complete' : 'incomplete'}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
}

interface CheckIconProps extends React.SVGProps<SVGSVGElement> {}

function CheckIcon(props: CheckIconProps) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          delay: 0.1,
          type: 'tween',
          ease: 'easeOut',
          duration: 0.3
        }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

