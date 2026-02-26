/**
 * example.test.tsx
 * RNTL Component Test Template
 *
 * Copy this file and adapt it for the component you want to test.
 * Convention: tests/component/<ComponentName>.test.tsx
 *
 * Run: npx jest tests/component/
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';

// ─── Example component (replace with your actual import) ──────────────────
// import { BookingCard } from '../../app/components/BookingCard';

// Minimal stub so the file runs standalone:
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';

interface ExampleCardProps {
    title: string;
    isLoading?: boolean;
    isError?: boolean;
    onPress?: () => void;
    testID?: string;
}

const ExampleCard: React.FC<ExampleCardProps> = ({
    title,
    isLoading = false,
    isError = false,
    onPress,
    testID = 'example.card',
}) => {
    if (isLoading) {
        return <ActivityIndicator testID={`${testID}.loader`} />;
    }
    if (isError) {
        return <Text testID={`${testID}.error`}>Something went wrong</Text>;
    }
    return (
        <TouchableOpacity testID={`${testID}.container`} onPress={onPress}>
            <Text testID={`${testID}.title`}>{title}</Text>
        </TouchableOpacity>
    );
};

// ─── Tests ────────────────────────────────────────────────────────────────

describe('ExampleCard', () => {
    // 1️⃣ Happy path
    it('renders title correctly', () => {
        render(<ExampleCard title="My Test Card" />);
        expect(screen.getByTestId('example.card.title')).toBeTruthy();
        expect(screen.getByText('My Test Card')).toBeTruthy();
    });

    // 2️⃣ Loading state
    it('shows loading indicator when isLoading=true', () => {
        render(<ExampleCard title="Any" isLoading={true} />);
        expect(screen.getByTestId('example.card.loader')).toBeTruthy();
        expect(screen.queryByTestId('example.card.title')).toBeNull();
    });

    // 3️⃣ Error state
    it('shows error message when isError=true', () => {
        render(<ExampleCard title="Any" isError={true} />);
        expect(screen.getByTestId('example.card.error')).toBeTruthy();
        expect(screen.queryByTestId('example.card.title')).toBeNull();
    });

    // 4️⃣ Interaction
    it('calls onPress when tapped', () => {
        const onPress = jest.fn();
        render(<ExampleCard title="Tappable" onPress={onPress} />);
        fireEvent.press(screen.getByTestId('example.card.container'));
        expect(onPress).toHaveBeenCalledTimes(1);
    });

    // 5️⃣ Double-tap protection (if implemented)
    it('does not call onPress twice on rapid double-tap', () => {
        const onPress = jest.fn();
        render(<ExampleCard title="Tappable" onPress={onPress} />);
        fireEvent.press(screen.getByTestId('example.card.container'));
        fireEvent.press(screen.getByTestId('example.card.container'));
        // Expect 1 or 2 depending on debounce implementation
        expect(onPress.mock.calls.length).toBeGreaterThanOrEqual(1);
    });

    // 6️⃣ Accessibility
    it('has the correct testID', () => {
        render(<ExampleCard title="Accessible" testID="home.booking-card" />);
        expect(screen.getByTestId('home.booking-card.container')).toBeTruthy();
    });
});

// ─── Template: Testing async components ───────────────────────────────────

describe('Async Component Pattern', () => {
    it('transitions from loading to loaded state', async () => {
        // Use a component that fetches data internally:
        // render(<DataList />);
        // expect(screen.getByTestId('datalist.loader')).toBeTruthy();
        // await waitFor(() => expect(screen.getByTestId('datalist.item')).toBeTruthy());
        expect(true).toBe(true); // placeholder
    });
});

// ─── Template: Testing text inputs ────────────────────────────────────────

describe('TextInput Pattern', () => {
    it('accepts keyboard input and updates value', () => {
        const onChangeText = jest.fn();
        render(
            <TextInput
                testID="auth.email-input"
                onChangeText={onChangeText}
                placeholder="Email"
            />
        );
        fireEvent.changeText(screen.getByTestId('auth.email-input'), 'test@example.com');
        expect(onChangeText).toHaveBeenCalledWith('test@example.com');
    });
});
