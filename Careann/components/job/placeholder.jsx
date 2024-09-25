<View className="flex-1">
            <Text style={styles.title}>Post a Job</Text>
            <TextInput
                style={styles.input}
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                style={styles.input}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
            />
            <TextInput
                style={styles.input}
                placeholder="Location"
                value={location}
                onChangeText={setLocation}
            />
            <TextInput
                style={styles.input}
                placeholder="Job Type"
                value={jobType}
                onChangeText={setJobType}
            />
            <TextInput
                style={styles.input}
                placeholder="Pay Rate"
                value={payRate}
                onChangeText={setPayRate}
                keyboardType="numeric"
            />
            
            <View style={styles.datePickerContainer}>
                <Button title="Select Scheduled Date" onPress={() => setShowDatePicker(true)} />
                {showDatePicker && (
                    <DateTimePicker
                        value={scheduledDate}
                        mode="date"
                        display="default"
                        onChange={onChangeDate}
                    />
                )}
                <Text style={styles.dateText}>
                    Scheduled Date: {scheduledDate.toLocaleDateString()}
                </Text>

                <Button title="Select Scheduled Time" onPress={() => setShowTimePicker(true)} />
                {showTimePicker && (
                    <DateTimePicker
                        value={scheduledTime}
                        mode="time"
                        display="default"
                        onChange={onChangeTime}
                    />
                )}
                <Text style={styles.dateText}>
                    Scheduled Time: {scheduledTime.toLocaleTimeString()}
                </Text>
            </View>

            <Button title="Post Job" onPress={handlePostJob} />
        </View>